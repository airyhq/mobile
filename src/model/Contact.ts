export interface Contact {
  displayName: string;
  avatarUrl?: string;
}

export const ContactSchema = {
  name: 'Contact',
  properties: {
    displayName: 'string',
    avatarUrl: 'string?',
  },
};
