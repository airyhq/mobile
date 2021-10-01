import {StompWrapper} from './stompWrapper';
import {MetadataEvent} from '../../model';
import {Message} from '../../model';
import {Tag} from '../../model/Tag';
import {Channel} from '../../model';
import {EventPayload} from './payload';
const camelcaseKeys = require('camelcase-keys');

type CallbackMap = {
  onMessage?: (
    conversationId: string,
    channelId: string,
    message: Message,
  ) => void;
  onMetadata?: (metadataEvent: MetadataEvent) => void;
  onChannel?: (channel: Channel) => void;
  onTag?: (tag: Tag) => void;
  onError?: () => void;
};

export class WebSocketClient {
  public readonly endpoint?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(
    apiUrl: string,
    accessToken: string,
    callbackMap: CallbackMap = {},
  ) {
    this.callbackMap = callbackMap;
    this.endpoint = `wss://${apiUrl.split('//')[1]}/ws.communication`;

    this.stompWrapper = new StompWrapper(
      this.endpoint,
      accessToken,
      {
        '/events': item => {
          this.onEvent(item.body);
        },
      },
      this.onError,
    );
    this.stompWrapper.initConnection();
  }

  destroyConnection = () => {
    this.stompWrapper.destroyConnection();
  };

  onEvent = (body: string) => {
    const json = JSON.parse(body) as EventPayload;
    switch (json.type) {
      case 'channel.updated':
        this.callbackMap.onChannel?.(
          camelcaseKeys(json.payload, {
            deep: true,
            stopPaths: ['metadata.user_data'],
          }),
        );
        break;
      case 'message.created':
        this.callbackMap.onMessage?.(
          json.payload.conversation_id,
          json.payload.channel_id,
          {
            ...camelcaseKeys(json.payload.message, {
              deep: true,
              stopPaths: ['content'],
            }),
            sentAt: new Date(json.payload.message.sent_at),
          },
        );
        break;
      case 'metadata.updated':
        this.callbackMap.onMetadata?.(json.payload);
        break;
      case 'tag.updated':
        this.callbackMap.onTag?.(json.payload);
        break;
      default:
        console.error('Unknown /events payload', json);
    }
  };

  onError = () => {
    this.callbackMap.onError && this.callbackMap.onError();
  };
}
