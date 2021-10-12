import {ContentMessage} from './Message';

export interface TextContent extends ContentMessage {
  type: 'text';
  text: string;
}

export const TextContentSchema = {
  name: 'TextContent',
  properties: {
    type: 'string',
    text: 'string',
  },
};
