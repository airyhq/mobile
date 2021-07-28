import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-native';

//import MessageList from '../MessageList';
//import EmptyStateImage from '../assets/images/empty-state/inbox-empty-state.svg';

// import ConversationMetadata from '../ConversationMetadata';
// import ConversationHeader from '../ConversationHeader';
// import MessageInput from '../../MessageInput';
import {Source, Suggestions} from '../../../model';
import { View } from 'react-native';

type MessengerContainerProps = any

const MessengerContainer = ({
  conversations,
  currentConversation,
  getConversationInfo,
  match,
}: MessengerContainerProps) => {
  //const [suggestions, showSuggestedReplies] = useState<Suggestions>(null);

//   useEffect(() => {
//     if (!currentConversation && match.params.conversationId) {
//       getConversationInfo(match.params.conversationId);
//     }
//   }, [currentConversation, match.params.conversationId]);

//   const hideSuggestedReplies = () => {
//     showSuggestedReplies(null);
//   };

  return (
    <View></View>
  );
};

export default MessengerContainer;