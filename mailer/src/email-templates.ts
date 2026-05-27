export interface EmailContentInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  language?: 'nl-nl' | 'en-gb';
}

export interface EmailContent {
  html: string;
  text: string;
  subject: string;
}

import { SiteConfig } from './configurations';

type LanguageKey = 'nl-nl' | 'en-gb';

interface EmailTranslations {
  notification: {
    title: string;
    subject: (name: string) => string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    companyLabel: string;
    messageLabel: string;
  };
  confirmation: {
    title: (name: string) => string;
    subject: string;
    receivedMessage: string;
    copyOfSubmission: string;
    regards: string;
    nameLabel: string;
    phoneLabel: string;
    companyLabel: string;
    messageLabel: string;
  };
}

const translations: Record<LanguageKey, EmailTranslations> = {
  'nl-nl': {
    notification: {
      title: 'Nieuwe inzending contactformulier',
      subject: (name: string) => `Nieuwe inzending contactformulier van ${name}`,
      nameLabel: 'Naam',
      emailLabel: 'E-mail',
      phoneLabel: 'Telefoon',
      companyLabel: 'Bedrijf',
      messageLabel: 'Bericht',
    },
    confirmation: {
      title: (name: string) => `Bedankt voor uw inzending, ${name}!`,
      subject: 'Bevestiging van uw inzending',
      receivedMessage: 'We hebben uw bericht ontvangen en nemen zo spoedig mogelijk contact met u op.',
      copyOfSubmission: 'Hier is een kopie van uw inzending:',
      regards: 'Met vriendelijke groet,',
      nameLabel: 'Naam',
      phoneLabel: 'Telefoon',
      companyLabel: 'Bedrijf',
      messageLabel: 'Bericht',
    },
  },
  'en-gb': {
    notification: {
      title: 'New Contact Form Submission',
      subject: (name: string) => `New Contact Form Submission from ${name}`,
      nameLabel: 'Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      companyLabel: 'Company',
      messageLabel: 'Message',
    },
    confirmation: {
      title: (name: string) => `Thank You for Your Submission, ${name}!`,
      subject: 'Confirmation of Your Submission',
      receivedMessage: 'We have received your message and will get back to you as soon as possible.',
      copyOfSubmission: "Here's a copy of your submission:",
      regards: 'Kind regards,',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      companyLabel: 'Company',
      messageLabel: 'Message',
    },
  },
};

export const generateNotificationEmail = (payload: EmailContentInput, language: LanguageKey = 'en-gb', siteConfig: SiteConfig): EmailContent => {
  const lang = language === 'nl-nl' ? 'nl-nl' : 'en-gb';
  const t = translations[lang].notification;

  const subject = t.subject(payload.name);

  const html = `
    <h1>${t.title}</h1>
    <p><strong>${t.nameLabel}:</strong> ${payload.name}</p>
    <p><strong>${t.emailLabel}:</strong> ${payload.email}</p>
    ${payload.phone ? `<p><strong>${t.phoneLabel}:</strong> ${payload.phone}</p>` : ''}
    ${payload.company ? `<p><strong>${t.companyLabel}:</strong> ${payload.company}</p>` : ''}
    <p><strong>${t.messageLabel}:</strong></p>
    <p>${payload.message.replace(/\n/g, '<br>')}</p>
  `;

  const text = `
    ${t.title}
    ${t.nameLabel}: ${payload.name}
    ${t.emailLabel}: ${payload.email}
    ${payload.phone ? `${t.phoneLabel}: ${payload.phone}` : ''}
    ${payload.company ? `${t.companyLabel}: ${payload.company}` : ''}
    ${t.messageLabel}:
    ${payload.message}
  `;
  return { html, text, subject };
};

export const generateConfirmationEmail = (
  payload: EmailContentInput,
  language: LanguageKey = 'en-gb',
  siteConfig: SiteConfig,
): EmailContent => {
  const lang = language === 'nl-nl' ? 'nl-nl' : 'en-gb';
  const t = translations[lang].confirmation;

  const title = t.title(payload.name);
  const subject = t.subject;

  const html = `
    <h1>${title}</h1>
    <p>${t.receivedMessage}</p>
    <p>${t.copyOfSubmission}</p>
    <blockquote>
      <p><strong>${t.nameLabel}:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      ${payload.phone ? `<p><strong>${t.phoneLabel}:</strong> ${payload.phone}</p>` : ''}
      ${payload.company ? `<p><strong>${t.companyLabel}:</strong> ${payload.company}</p>` : ''}
      <p><strong>${t.messageLabel}:</strong></p>
      <p>${payload.message.replace(/\n/g, '<br>')}</p>
    </blockquote>
    <p>${t.regards}</p>
    <p>${siteConfig.notificationEmailSenderName}</p>
  `;

  const text = `
    ${title}

    ${t.receivedMessage}

    ${t.copyOfSubmission}
    ${t.nameLabel}: ${payload.name}
    Email: ${payload.email}
    ${payload.phone ? `${t.phoneLabel}: ${payload.phone}` : ''}
    ${payload.company ? `${t.companyLabel}: ${payload.company}` : ''}
    ${t.messageLabel}:
    ${payload.message}

    ${t.regards}
    ${siteConfig.notificationEmailSenderName}
  `;
  return { html, text, subject };
};
