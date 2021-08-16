import {StompWrapper} from './stompWrapper';
import {MetadataEvent} from '../../model/Metadata';
import {Message} from '../../model/Message';
import {Tag} from '../../model/Tag';
import {Channel} from '../../model/Channel';
import {EventPayload} from './payload';
import { getUserInfo } from '../../model/userInfo';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

const accessToken = getUserInfo()?.accessToken;

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

// https: -> wss: and http: -> ws:
// const protocol = location.protocol.replace('http', 'ws');

export class WebSocketClient {
  public readonly apiUrlConfig?: string;

  stompWrapper: StompWrapper;
  callbackMap: CallbackMap;

  constructor(apiUrl: string, callbackMap: CallbackMap = {}) {
    this.callbackMap = callbackMap;
    this.apiUrlConfig = `ws://${new URL(apiUrl)}ws.communication`;

    this.stompWrapper = new StompWrapper(
      
      this.apiUrlConfig,
      {
        '/events': item => {
          this.onEvent(item.body);
        },
      },
      this.onError,
    );
    this.stompWrapper.initConnection(accessToken);
  }

  destroyConnection = () => {
    this.stompWrapper.destroyConnection();
  };

  onEvent = (body: string) => {
    console.log('++++++++++++++ BODY: ', body);

    const json = JSON.parse(body) as EventPayload;
    switch (json.type) {
      case 'channel':
        this.callbackMap.onChannel?.(
          camelcaseKeys(json.payload, {
            deep: true,
            stopPaths: ['metadata.user_data'],
          }),
        );
        break;
      case 'message':
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
      case 'metadata':
        this.callbackMap.onMetadata?.(json.payload);
        break;
      case 'tag':
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
