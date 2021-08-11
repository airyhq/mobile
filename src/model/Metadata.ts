export interface Metadata {
  userData?: Metadata;
  [key: string]: any;
}
export interface MetadataEvent<T extends Metadata = Metadata> {
  subject: string;
  identifier: string;
  metadata: T;
}

export const MetadataSchema = {
  name: 'Metadata',
  properties: {
    contact: 'Contact',
    unreadCount: 'int',
    state: 'string?'
  },
};

export const MetadataEventSchema = {
  name: 'MetadataEvent',
  properties: {
    subject: 'string',
    identifier: 'string',
    metadata: 'Metadata'
  },
};
