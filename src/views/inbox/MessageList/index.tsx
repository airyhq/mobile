import React from 'react';
import {Text} from 'react-native';


export const MessageList = (props:any) => {

    console.log('props.match', props)


    return(
        <Text>{props.match.params.conversationId}</Text>
    )
}