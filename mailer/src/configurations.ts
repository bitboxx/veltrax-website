export interface SiteConfig {
  allowedOrigins: string[]; // e.g., ['pixeau.nl', 'subdomain.pixeau.nl']
  toAddress: string;
  fromAddress: string; // Should be a verified sender in your email service
  notificationSenderName: string;
  notificationRecipientName: string;
  mailerUserSecretName: string;
  mailerPassSecretName: string;
  notificationEmailSenderName?: string;
  sendConfirmation?: boolean;
  smtpHost: string;
  smtpPort: number;
}

export type AppConfig = SiteConfig[];

const smtpHost =  'witcher.mxrouting.net';
const smtpPort =  465;

export const configurations: AppConfig = [
  {
    allowedOrigins: ['decaltra.com'],
    toAddress: 'info@decaltra.com',
    fromAddress: 'info@decaltra.com',
    notificationSenderName: 'Decaltra.com',
    notificationRecipientName: 'Decaltra',
    mailerUserSecretName: 'DECALTRACOM_MAILER_USER',
    mailerPassSecretName: 'DECALTRACOM_MAILER_PASS',
    notificationEmailSenderName: 'The Decaltra Team',
    sendConfirmation: true,
    smtpHost,
    smtpPort,
  },
];

export const getSiteConfigByOrigin = (origin: string | null): SiteConfig | undefined => {
  if (!origin) {
    return undefined;
  }
  for (const config of configurations) {
    // Check if the origin string contains any of the allowed origin substrings
    if (config.allowedOrigins.some(allowedOriginSubstring => origin.includes(allowedOriginSubstring))) {
      return config;
    }
  }
  return undefined;
};
