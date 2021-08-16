import {
  ActivationState,
  Client,
  IFrame,
  IMessage,
  StompSubscription,
} from '@stomp/stompjs';
import { RealmDB } from '../../storage/realm';

type QueueMappingType = {[destination: string]: (message: IMessage) => void};
type ErrorCallback = () => void;

const realm = RealmDB.getInstance()
const accessToken: any = realm.objects('UserInfo')[0]
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
      onChangeState: this.onChangeState,
      onUnhandledFrame: this.onWSError,
      onUnhandledMessage: this.onWSError,
      onUnhandledReceipt: this.onWSError,
      onWebSocketClose: this.onWSError,
      appendMissingNULLonIncoming: true
    });
    
    this.stompClient.activate();
  };

  destroyConnection = () => {
    console.log('STOMP DESTRORY');

    this.stompClient?.deactivate();
    if (this.queues) {
      this.queues.filter(it => !!it).forEach(queue => queue.unsubscribe());
    }
  };

  stompOnConnect = () => {
    console.log('STOMP ON CONNECT');
    

    this.queues = Object.keys(this.queueMapping).reduce(
      (acc: any, queue: any) =>
        acc.concat([
          this.stompClient?.subscribe(queue, this.queueMapping[queue]),
        ]),
      [],
    );
  };

  stompOnError = (error: IFrame) => {
    console.log('STOMP ERROR');

    if (error.headers.message.includes('401')) {
      this.onError();
    }
  };

  onWSError = (error: IFrame) => {
    console.log('WS Error');
    console.log(error);
  };

  onChangeState = (state: ActivationState) => {
    // console.log('STATE');
    // console.log(state);
    // console.log(this.stompClient?.active);
  };

  publish = (queue: any, body: any) => {
    if (!this.stompClient || !this.stompClient.connected) {
      return false;
    }
    this.stompClient.publish({
      destination: queue,
      body: JSON.stringify(body),
    });
  };

  refreshSocket = () => {
    this.destroyConnection();
    this.initConnection(accessToken);
  };
}
