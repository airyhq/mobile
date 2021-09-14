import React from 'react';
import Linkify from 'linkifyjs/react';
import {StyleSheet, View} from 'react-native';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
  sourceName: string;
};

export const UnknownSourceText = ({
  text,
  fromContact,
  sourceName,
}: TextRenderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.unknownSourceHeader}>
        <View style={styles.unknownSource}>
          {sourceName ?? 'Unknown'} Source
        </View>
      </View>
      <Linkify
        tagName="div"
        className={`${
          fromContact ? styles.contactContent : styles.memberContent
        }`}
        options={{
          defaultProtocol: 'https',
          className: `${styles.messageLink} ${
            fromContact ? styles.contactContent : styles.memberContent
          }`,
        }}>
        {text}
      </Linkify>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  unknownSourceHeader: {},
  unknownSource: {},
  contactContent: {},
  memberContent: {},
  messageLink: {},
});
