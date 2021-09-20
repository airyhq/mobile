import {Metadata} from './Metadata';

export type ChannelMetadata = Metadata & {
  name: string;
  imageUrl?: string;
};

export const ChannelMetadataSchema = {
  name: 'ChannelMetadata',
  properties: {
    name: 'string',
    imageUrl: 'string?',
  },
};

export interface Channel {
  id?: string;
  metadata: ChannelMetadata;
  source: string;
  sourceChannelId: string;
  connected: boolean;
  phoneNumber?: string;
}

export const ChannelSchema = {
  name: 'Channel',
  properties: {
    id: 'string?',
    metadata: 'ChannelMetadata',
    source: 'string',
    sourceChannelId: 'string',
    connected: 'bool?',
  },
};

export enum Source {
  facebook = 'facebook',
  instagram = 'instagram',
  google = 'google',
  viber = 'viber',
  chatplugin = 'chatplugin',
  twilioSms = 'twilio.sms',
  twilioWhatsapp = 'twilio.whatsapp',
  unknown = 'unknown',
}
