import {
  Client,
  IFrame,
  IMessage,
  StompSubscription,
} from '@stomp/stompjs';
import { UserInfo } from '../../model/userInfo';
import {RealmDB} from '../../storage/realm';

type QueueMappingType = {[destination: string]: (message: IMessage) => void};
type ErrorCallback = () => void;

const realm = RealmDB.getInstance();
const accessToken: string = realm.objects<UserInfo>('UserInfo')[0]?.accessToken;
export class StompWrapper {
  stompClient?: Client;
  onError: ErrorCallback;
  url: string;
  queues?: StompSubscription[];
  queueMapping: QueueMappingType;

  constructor(
    url: string,
    queueMapping: QueueMappingType,
    onError: ErrorCallback,
  ) {
    this.url = url;
    this.queueMapping = queueMapping;
    this.onError = onError;
  }

  initConnection = (token: string | undefined) => {
    this.stompClient = new Client({
      brokerURL: this.url,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 2000,
      onWebSocketError: this.onWSError,
      onDisconnect: this.onWSError,
      onConnect: this.stompOnConnect,
      onStompError: this.stompOnError,
      appendMissingNULLonIncoming: true,
    });
    this.stompClient.activate();
  };

  destroyConnection = () => {
    this.stompClient?.deactivate();
    if (this.queues) {
      this.queues.filter(it => !!it).forEach(queue => queue.unsubscribe());
    }
  };

  stompOnConnect = () => {
    this.queues = Object.keys(this.queueMapping).reduce(
      (acc: any, queue: any) =>
        acc.concat([
          this.stompClient?.subscribe(queue, this.queueMapping[queue]),
        ]),
      [],
    );
  };

  stompOnError = (error: IFrame) => {
    if (error.headers.message.includes('401')) {
      this.onError();
    }
  };

  onWSError = (error: IFrame) => {
    return error
  };

  refreshSocket = () => {
    this.destroyConnection();
    this.initConnection(accessToken);
  };
}
