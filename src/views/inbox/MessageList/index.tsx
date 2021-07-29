import React from 'react';
import {Text} from 'react-native';


export const MessageList = (props:any) => {

    console.log('props.match', props)


    return(
        <Text>MESSAGE LIST {props.match.params.conversationId}</Text>
    )
}