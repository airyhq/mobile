import {StompWrapper} from './stompWrapper';
import {MetadataEvent} from '../../model/Metadata';
import {Message} from '../../model/Message';
import {Tag} from '../../model/Tag';
import {Channel} from '../../model/Channel';
import {EventPayload} from './payload';
import {RealmDB} from '../../storage/realm';
import {UserInfo} from '../../model/userInfo';
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

const realm = RealmDB.getInstance();
const accessToken: string = realm.objects<UserInfo>('UserInfo')[0]?.accessToken;

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
