import React, {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-native';
import {User} from '../../model';
import Messenger from './Messenger';
import {setPageTitle} from '../../services/PageTitle';


export type ConversationRouteProps = RouteComponentProps<{conversationId: string}>;

interface InboxProps {
  user: User;
}


const ConversationContainer = (props: any) => {
  const {totalConversations, listChannels, listConversations} = props;

  useEffect(() => {
    listConversations();
    listChannels();
  }, []);

  useEffect(() => {
    setPageTitle(`Inbox (${totalConversations})`);
  }, [totalConversations]);

  return <Messenger />;
};

export default ConversationContainer;