import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextComponent} from '../../../../components/Text';
import {Fallback} from '../../facebookModel';

interface FallbackProps {
  content: Fallback;
  fromContact?: boolean;
}

export function FallbackAttachment({content, fromContact}: FallbackProps) {
  return (
    <View style={styles.wrapper}>
      {content.text && (
        <TextComponent fromContact={fromContact || false} text={content.text} />
      )}

      {content.title && (
        <TextComponent
          fromContact={fromContact || false}
          text={content.title}
        />
      )}

      {content.url && (
        <TextComponent fromContact={fromContact || false} text={content.url} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
});
