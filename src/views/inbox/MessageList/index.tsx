import React from 'react';
import { Dimensions } from 'react-native';
import {StyleSheet, Text, SafeAreaView} from 'react-native';


const MessageList = (props: any) => {
    return(
        <SafeAreaView style={styles.container}>
        </SafeAreaView>
    )
}

export default MessageList

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: 'white'
    }
})