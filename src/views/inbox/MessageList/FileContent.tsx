import React from 'react';
import {StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';

type FileContentProps = {
  route: any;
};

export const FileContent = (props: FileContentProps) => {
  const source = {uri: props.route.params.fileUrl};

  return (
    <View style={styles.container}>
      <Pdf source={source} style={styles.pdf} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
  },
});
