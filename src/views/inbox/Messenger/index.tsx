import React from 'react';
import {Route, withRouter, Redirect} from 'react-router-native';
import ConversationList from '../ConversationList';
import MessengerContainer from './MessengerContainer';
import { StyleSheet, View } from 'react-native';


const Messenger = (props: any) => {
  const {conversations, match} = props;

  console.log('match', match)

  // const waitForContentAndRedirect = (conversations: MergedConversation[]) => {
  //   const conversationId = conversations[0].id;
  //   const targetPath = `/inbox/conversations/${conversationId}`;
  //   if (targetPath !== window.location.pathname) {
  //     return <Redirect to={targetPath} />;
  //   }
  // };

  // if (match.isExact && conversations.length) {
  //   return waitForContentAndRedirect(conversations);
  // }

  return (
    <View style={styles.wrapper}>
      <Route
        path={[`${match.url}/conversations/:conversationId`, `${match.url}`]}
        render={props => (
          <>
            {!!conversations && (
              <View style={styles.leftPanel}>
                <ConversationList />
              </View>
            )}

            <MessengerContainer {...props} />
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:{

  },
  leftPanel:{

  }
});


export default Messenger;