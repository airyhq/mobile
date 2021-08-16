import React, {useState} from 'react';
import {useEffect} from 'react';
import {Conversation} from '../model/Conversation';
import {Message} from '../model/Message';
import {Tag} from '../model/Tag';
import {RealmDB} from '../storage/realm';
import {WebSocketClient} from './WebsocketClient/WebsocketClient';

type AiryWebSocketProps = {
  children: React.ReactNode;
};

export const AiryWebSocketContext = React.createContext({});

export const AiryWebSocket = (props: AiryWebSocketProps) => {
  const {children} = props;
  const realm = RealmDB.getInstance();

  const [webSocketClient, setWebSocketClient] =
    useState<WebSocketClient | null>(null);
  const [conversations, setConversations] = useState<
    Realm.Results<Conversation>
  >(realm.objects<Conversation>('Conversation'));
  const [messages, setMessages] = useState<Realm.Results<Message>>(
    realm.objects<Message>('Message'),
  );
  const [tags, setTags] = useState<Realm.Results<Tag>>(
    realm.objects<Tag>('Tag'),
  );

  useEffect(() => refreshSocket(), []);

  // Register for changes
  //   useEffect(() => {
  //     const handleChange: Realm.CollectionChangeCallback<Conversation> = (
  //       _, // Contains current collection
  //       changes,
  //     ) => {
  //       if (
  //         changes.deletions.length > 0 ||
  //         changes.insertions.length > 0 ||
  //         changes.newModifications.length > 0
  //       ) {
  //         setConversations(realm.objects('Conversation'));
  //       }
  //     };
  //     conversations.addListener(handleChange);
  //     return () => {
  //       conversations.removeListener(handleChange);
  //     };
  //   }, [conversations, setConversations]);

  //   useEffect(() => {
  //     const handleChange: Realm.CollectionChangeCallback<Message> = (
  //       _, // Contains current collection
  //       changes,
  //     ) => {
  //       if (
  //         changes.deletions.length > 0 ||
  //         changes.insertions.length > 0 ||
  //         changes.newModifications.length > 0
  //       ) {
  //         setMessages(realm.objects('Message'));
  //       }
  //     };
  //     messages.addListener(handleChange);
  //     return () => {
  //       messages.removeListener(handleChange);
  //     };
  //   }, [messages, setMessages]);

  //   useEffect(() => {
  //     const handleChange: Realm.CollectionChangeCallback<Tag> = (
  //       _, // Contains current collection
  //       changes,
  //     ) => {
  //       if (
  //         changes.deletions.length > 0 ||
  //         changes.insertions.length > 0 ||
  //         changes.newModifications.length > 0
  //       ) {
  //         setTags(realm.objects('Tag'));
  //       }
  //     };
  //     tags.addListener(handleChange);
  //     return () => {
  //       tags.removeListener(handleChange);
  //     };
  //   }, [tags, setTags]);

  //   const currentConversation = realm.objectForPrimaryKey(
  //     'Conversation',
  //     conversation.id,
  //   );

  const addMessages = (conversationId: string, messages: Message[]) => {
    realm.write(() => {
      for (const message of messages) {
        realm.create('Message', {
          id: message.id,
          content: message.content,
          deliveryState: message.deliveryState,
          fromContact: message.fromContact,
          sentAt: message.sentAt,
          metadata: message.metadata,
        });
      }
    });
  };

  const onMessage = (conversationId?: string, message?: Message) => {
    console.log('ON MESSAGE +++++++');

    if (conversationId && message) {
      console.log('IN IF +++++++');

      const isStored = realm.objectForPrimaryKey(
        'Conversation',
        conversationId,
      );
      if (isStored) {
        addMessages(conversationId, [message]);
        console.log('IS STORED AND ADDED');
      } else {
        console.log('WOULD BE FIRST MESSAGE');

        realm.write(() => {
          // realm.create('Conversation');
          addMessages(conversationId, [message]);
        });
      }
    }
  };

  const refreshSocket = () => {
    if (webSocketClient) {
      webSocketClient.destroyConnection();
    }
    setWebSocketClient(
      new WebSocketClient('airy.core', {
        onMessage: (
          conversationId: string,
          _channelId: string,
          message: Message,
        ) => {
          onMessage(conversationId, message);
        },
        // onChannel,
        // onMetadata,
        // onTag,
      }),
    );
  };

  return (
    <AiryWebSocketContext.Provider value={{refreshSocket}}>
      {children}
    </AiryWebSocketContext.Provider>
  );
};
