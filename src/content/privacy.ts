/**
 * Privacy policy content and related constants.
 * Edit the text here; the in-app Privacy screen and docs/privacy-policy.md mirror it.
 */

export const CONTACT_EMAIL = 'hello@bharatdarshan.app';
export const PRIVACY_POLICY_URL =
  'https://adarshsahu69-dev.github.io/Bharat-darshan-app/privacy-policy';

export const PRIVACY_LAST_UPDATED = '23 November 2026';

export type PrivacySection = {
  title: string;
  body: string;
};

export const privacySections: PrivacySection[] = [
  {
    title: 'Overview',
    body:
      'Bharat Darshan is designed to help you explore India\'s heritage. We keep this policy plain and honest about what the app does today.',
  },
  {
    title: 'Information Stored on Your Device',
    body:
      'Saved places, trips, and your profile name are stored only on your device. We do not upload this information to our servers, and it stays on your device unless you remove it or uninstall the app.',
  },
  {
    title: 'Information We Load from the Internet',
    body:
      'Monument information is loaded from our Supabase database over the internet so the app can show heritage details. No account is required, and no personal data is sent as part of loading this information.',
  },
  {
    title: 'Information We Do Not Collect',
    body:
      'The app does not collect your location, contacts, photos, or advertising identifiers. At this time, Bharat Darshan has no analytics, no advertising, and no third-party tracking SDKs.',
  },
  {
    title: 'External Services',
    body:
      '"Get Directions" opens Google Maps in another app. When you use Google Maps, your use is governed by Google\'s own privacy policy and terms. Bharat Darshan does not control how Google handles information in that app.',
  },
  {
    title: 'Children\'s Privacy',
    body:
      'Bharat Darshan is intended for a general audience and does not knowingly collect personal information from children. Because the app does not require an account and does not collect personal data, there is no personal information for us to sell or share.',
  },
  {
    title: 'Changes to This Policy',
    body:
      'We may update this policy when the app changes. When we do, we will update the "Last updated" date on this screen and in the hosted policy. We encourage you to review this policy from time to time.',
  },
  {
    title: 'Contact',
    body:
      `If you have questions about this policy or Bharat Darshan's privacy practices, contact us at ${CONTACT_EMAIL}.`,
  },
];
