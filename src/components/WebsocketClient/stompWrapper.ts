import {Client, IFrame, IMessage, StompSubscription} from '@stomp/stompjs';

type QueueMappingType = {[destination: string]: (message: IMessage) => void};
type ErrorCallback = () => void;

export class StompWrapper {
  stompClient?: Client;
  onError: ErrorCallback;
  url: string;
  queues?: StompSubscription[];
  queueMapping: QueueMappingType;
  token: string;

  constructor(
    url: string,
    token: string,
    queueMapping: QueueMappingType,
    onError: ErrorCallback,
  ) {
    this.url = url;
    this.queueMapping = queueMapping;
    this.token = token;
    this.onError = onError;
  }

  initConnection = () => {
    this.stompClient = new Client({
      brokerURL: this.url,
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      reconnectDelay: 2000,
      onWebSocketError: this.onWSError,
      onDisconnect: this.onWSError,
      onConnect: this.stompOnConnect,
      onStompError: this.stompOnError,
      forceBinaryWSFrames: true,
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
    return error;
  };

  refreshSocket = () => {
    this.destroyConnection();
    this.initConnection();
  };
}
