export interface Message {
  id: string;
  content: Content;
  deliveryState: DeliveryState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
}