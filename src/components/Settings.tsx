import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export const Settings = () => {

  const array = ['a', 'b', 'c']

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.header}>Header</Text>
          <TextInput placeholder="Username" style={styles.textInput} />

          <View style={styles.btnContainer}>
            <Button title="Submit" onPress={() => null} />
          </View>

          {/* <View style={{backgroundColor: 'green', height: 200, width: 200}}/> */}

          <View style={{backgroundColor: 'orange'}}>
          <FlatList
          style={{backgroundColor: 'blue', height: 200, width: 200}}
                data={array}
                renderItem={({item, index}) => {
                  return (
                    <Button title={item} onPress={() => console.log('abc')} key={index}/>
                  );
                }}
              />
              </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  inner: {
    padding: 24,
    paddingTop: 400,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});
