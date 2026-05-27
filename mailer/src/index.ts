import { WorkerMailer } from 'worker-mailer';
import { generateNotificationEmail, generateConfirmationEmail, EmailContentInput } from './email-templates';
import { getSiteConfigByOrigin, SiteConfig } from './configurations';

const MIN_MESSAGE_LENGTH = 0;
const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Site-ID',
};

export interface Env {
  [key: string]: string;
}

interface ContactFormPayload extends EmailContentInput {
  language?: 'nl-nl' | 'en-gb';
}

const sendOk = (headers: Record<string, string>): Response => {
  return new Response('OK', { status: 200, headers });
};

const handleOptions = (request: Request): Response => {
  const origin = request.headers.get('Origin');
  const siteConfig = getSiteConfigByOrigin(origin);

  if (siteConfig && origin) {
    return new Response(null, {
      status: 204,
      headers: {
        ...CORS_HEADERS,
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': CORS_HEADERS['Access-Control-Allow-Methods'],
      'Access-Control-Allow-Headers': CORS_HEADERS['Access-Control-Allow-Headers'],
      'Access-Control-Max-Age': '86400',
    },
  });
};

const handlePost = async (request: Request, env: Env): Promise<Response> => {
  const origin = request.headers.get('Origin');
  const siteConfig = getSiteConfigByOrigin(origin);

  if (!siteConfig || !origin) {
    return new Response('Forbidden: Invalid origin or configuration not found.', { status: 403 });
  }

  const corsHeadersWithOrigin = {
    ...CORS_HEADERS,
    'Access-Control-Allow-Origin': origin,
  };

  try {
    const payload = await request.json<ContactFormPayload>();
    const language = payload.language === 'nl-nl' ? 'nl-nl' : 'en-gb';

    if (!payload.email || !isValidEmail(payload.email)) {
      return new Response('Invalid email format.', { status: 400, headers: corsHeadersWithOrigin });
    }

    if (!payload.message || payload.message.length < MIN_MESSAGE_LENGTH) {
      return sendOk(corsHeadersWithOrigin);
    }

    const mailerUser = env[siteConfig.mailerUserSecretName];
    const mailerPass = env[siteConfig.mailerPassSecretName];

    if (!mailerUser || !mailerPass) {
      console.error(`Mailer credentials not found for site: ${origin}. Missing ${siteConfig.mailerUserSecretName} or ${siteConfig.mailerPassSecretName} in environment variables.`);
      return new Response('Internal Server Error: Mailer configuration missing.', { status: 500, headers: corsHeadersWithOrigin });
    }

    const connectOptions = {
      credentials: {
        username: mailerUser,
        password: mailerPass,
      },
      authType: 'plain' as const,
      host: siteConfig.smtpHost,
      port: siteConfig.smtpPort,
      secure: siteConfig.smtpPort === 465,
    };

    let mailer;
    try {
      mailer = await WorkerMailer.connect(connectOptions);
    } catch (firstError) {
      console.warn('SMTP connect failed, retrying once:', firstError);
      await new Promise((resolve) => setTimeout(resolve, 500));
      mailer = await WorkerMailer.connect(connectOptions);
    }

    const notificationEmailContent = generateNotificationEmail(payload, language, siteConfig);

    await mailer.send({
      from: {
        name: siteConfig.notificationSenderName,
        email: siteConfig.fromAddress,
      },
      to: {
        name: siteConfig.notificationRecipientName,
        email: siteConfig.toAddress,
      },
      reply: {
        name: payload.name,
        email: payload.email,
      },
      subject: notificationEmailContent.subject,
      text: notificationEmailContent.text,
      html: notificationEmailContent.html,
    });

    if (siteConfig.sendConfirmation !== false) {
      const confirmationEmailContent = generateConfirmationEmail(payload, language, siteConfig);
      await mailer.send({
        from: {
          name: siteConfig.notificationEmailSenderName,
          email: siteConfig.fromAddress,
        },
        to: {
          name: payload.name,
          email: payload.email,
        },
        reply: {
          name: siteConfig.notificationRecipientName,
          email: siteConfig.toAddress,
        },
        subject: confirmationEmailContent.subject,
        text: confirmationEmailContent.text,
        html: confirmationEmailContent.html,
      });
    }

    return sendOk(corsHeadersWithOrigin);
  } catch (error: unknown) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error('Error processing request:', message, error);
    return new Response('Error processing request', { status: 500, headers: corsHeadersWithOrigin });
  }
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    if (request.method === 'POST') {
      return handlePost(request, env);
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
