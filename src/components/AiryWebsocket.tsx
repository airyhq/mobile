import React, {useState} from 'react';
import {useEffect} from 'react';
import {HttpClientInstance} from '../InitializeAiryApi';
import {Metadata} from '../model';
import {Conversation, parseToRealmConversation} from '../model/Conversation';
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
  // useEffect(() => {
  //   const handleChange: Realm.CollectionChangeCallback<Conversation> = (
  //     _, // Contains current collection
  //     changes,
  //   ) => {
  //     if (
  //       changes.deletions.length > 0 ||
  //       changes.insertions.length > 0 ||
  //       changes.newModifications.length > 0
  //     ) {
  //       setConversations(realm.objects('Conversation'));
  //     }
  //   };
  //   conversations.addListener(handleChange);
  //   return () => {
  //     conversations.removeListener(handleChange);
  //   };
  // }, [conversations, setConversations]);

  // useEffect(() => {
  //   const handleChange: Realm.CollectionChangeCallback<Message> = (
  //     _, // Contains current collection
  //     changes,
  //   ) => {
  //     if (
  //       changes.deletions.length > 0 ||
  //       changes.insertions.length > 0 ||
  //       changes.newModifications.length > 0
  //     ) {
  //       setMessages(realm.objects('Message'));
  //     }
  //   };
  //   messages.addListener(handleChange);
  //   return () => {
  //     messages.removeListener(handleChange);
  //   };
  // }, [messages, setMessages]);

  // useEffect(() => {
  //   const handleChange: Realm.CollectionChangeCallback<Tag> = (
  //     _, // Contains current collection
  //     changes,
  //   ) => {
  //     if (
  //       changes.deletions.length > 0 ||
  //       changes.insertions.length > 0 ||
  //       changes.newModifications.length > 0
  //     ) {
  //       setTags(realm.objects('Tag'));
  //     }
  //   };
  //   tags.addListener(handleChange);
  //   return () => {
  //     tags.removeListener(handleChange);
  //   };
  // }, [tags, setTags]);

  const addMessage = (conversationId: string, message: Message) => {
    if (conversationId && message) {
      realm.write(() => {
        const currentConversation: any = realm.objectForPrimaryKey(
          'Conversation',
          conversationId,
        );
        currentConversation.lastMessage = message;
      });
    }
  };

  const getInfoNewConversation = (conversationId: string, retries: number) => {
    if (retries > 5) {
      return Promise.reject(true);
    } else {
      HttpClientInstance.getConversationInfo(conversationId)
        .then((response: any) => {
          realm.write(() => {
            realm.create('Conversation', parseToRealmConversation(response));
          });
        })
        .catch((error: Error) => {
          console.log('Error: ', error);
          setTimeout(() => {
            getInfoNewConversation(conversationId, retries ? retries + 1 : 1);
          }, 1000);
        });
    }
  };

  const onMetadata = (metadata: Metadata) => {
    const currentConversation: any = realm.objectForPrimaryKey(
      'Conversation',
      metadata.identifier,
    );

    if (currentConversation && (metadata.metadata.unread_count === 0 || 1)) {
      realm.write(() => {
        currentConversation.metadata.unreadCount = 0;
      });
    }
    if (currentConversation && metadata?.metadata?.contact?.display_name) {
      realm.write(() => {
        currentConversation.metadata.contact.displayName =
          metadata?.metadata?.contact?.display_name;
      });
    }
  };

  const onMessage = (conversationId?: string, message?: Message) => {
    if (conversationId && message) {
      const isStored = realm.objectForPrimaryKey(
        'Conversation',
        conversationId,
      );
      if (isStored) {
        addMessage(conversationId, message);
      } else {
        getInfoNewConversation(conversationId, 0);
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
        onMetadata: (metadata: Metadata) => {
          onMetadata(metadata);
        },
      }),
    );
  };

  return (
    <AiryWebSocketContext.Provider value={{refreshSocket}}>
      {children}
    </AiryWebSocketContext.Provider>
  );
};
