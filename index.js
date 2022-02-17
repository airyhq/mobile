import OneSignal from 'react-native-onesignal';
import {AppRegistry} from 'react-native';
import App, {navigationRef} from './src/App';
import {name as appName} from './app.json';
import {getAndOrFetchConversationById} from './src/services/conversation';


// /!/ removing this import causes errors
import * as encoding from 'text-encoding';

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId('d3d8d445-1cc5-4c20-8d1d-ea494369b2c9');
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log('Prompt response:', response);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {        
    notificationReceivedEvent.complete(null);
    //notificationReceivedEvent.complete(notification);
  },
);

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  const data = notification.notification.additionalData;    
  // Get information about the conversationId
  if (data) {
    const conversationId = data.conversation_id;
    navigationRef.current.navigate('Inbox');
    getAndOrFetchConversationById(conversationId).then(conversation => {
      navigationRef.current.navigate('MessageList', {
        conversationId,              
        avatarUrl: conversation.metadata.contact.avatarUrl,
        displayName: conversation.metadata.contact.displayName,
        state: conversation.metadata.state,
        source: conversation.channel.source,
        sourceChannelId: conversation.channel.sourceChannelId,
        metadataName: conversation.channel.metadata.name,
      });
    }).catch(error => {
      console.error(error);
    });    
  }
});

AppRegistry.registerComponent(appName, () => App);
