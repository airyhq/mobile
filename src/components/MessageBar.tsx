import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Conversation} from '../model/Conversation';
import {RealmDB} from '../storage/realm';
import {AttachmentBar} from './AttachmentBar';
import {InputBar} from './InputBar';

type MessageBarProps = {
  conversationId: string;
  items: number;
};

export const MessageBar = (props: MessageBarProps) => {
  const {conversationId} = props;
  const [extended, setExtended] = useState<boolean>();
  const [attachmentBarWidth, setAttachmentBarWidth] = useState(0);
  const padding = 30;
  const realm = RealmDB.getInstance();

  useEffect(() => {
    console.log('ATTACH: ', attachmentBarWidth);
  }, [])

  console.log('----: ', attachmentBarWidth);


  const source = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  ).channel.source;

  const extend = (extended: boolean) => {
    setExtended(extended);
  };

  const handleCallback = (width: number) => {
    setAttachmentBarWidth(width);
  };

  return (
    <View style={styles.contentBar}>
      <AttachmentBar
        source={source}
        extended={!extended}
        setExtended={extend}
        width={handleCallback}
      />
      <InputBar
        width={width - attachmentBarWidth - padding}
        conversationId={conversationId}
        extended={!!extended}
        setExtended={extend}
      />
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  contentBar: {
    backgroundColor: 'red',
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
