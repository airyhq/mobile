import React from 'react';
import {StyleSheet, View} from 'react-native';

import {TextComponent} from '../../../../components/Text';
import {VideoComponent} from '../../../../components/VideoComponent';
import {ImageComponent} from '../../../../components/ImageComponent';
import {ImageWithFallback} from '../../../../components/ImageWithFallback';
import { colorAiryBlue, colorTemplateHightlight} from '../../../../../assets/colors';
import {QuickReply, AttachmentUnion} from '../../chatPluginModel';
import {CommandUnion} from '../../../../props';

export type QuickRepliesRenderProps = {
  text?: string;
  attachment?: AttachmentUnion;
  fromContact?: boolean;
  quickReplies: QuickReply[];
  commandCallback?: (command: CommandUnion) => void;
};

export const QuickReplies = ({
  quickReplies,
  fromContact,
  text,
  attachment,
  commandCallback,
}: QuickRepliesRenderProps) => {
  const clickPostback = (reply: QuickReply) => {
    commandCallback &&
      commandCallback({
        type: 'quickReplies',
        payload: {
          text: reply.payload.text,
          postbackData: reply.payload.postbackData,
        },
      });
  };

  return (
    <View style={styles.wrapper}>
      {text && <TextComponent text={text} fromContact={fromContact} />}

      {attachment && 'text' in attachment && (
        <TextComponent text={attachment.text} fromContact={fromContact} />
      )}

      {attachment && 'imageUrl' in attachment && (
        <ImageComponent imageUrl={attachment.imageUrl} />
      )}

      {attachment && 'videoUrl' in attachment && (
        <VideoComponent videoUrl={attachment.videoUrl} />
      )}

      <View style={styles.container}>
        {quickReplies.map((reply: QuickReply) => (
          <button
            key={reply.title}
            style={styles.replyButton}
            onClick={() => clickPostback(reply)}>
            {reply.image_url && (
              <ImageWithFallback
                imageStyle={styles.quickReplyImage}
                alt={reply.title}
                src={reply.image_url}
              />
            )}
            <h1 key={reply.title} style={styles.title}>
              {reply.title}
            </h1>
          </button>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    marginTop: 5,
    alignItems: 'flex-end',
  },
  container: {
    flexWrap: 'wrap',
    marginTop: 5,
    justifyContent: 'flex-end',
  },
  replyButton: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginBottom: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorAiryBlue,
    backgroundColor: colorTemplateHightlight,
  },
  quickReplyImage: {
    width: 25,
    height: 25,
    marginRight: 6,
    borderRadius: 12.5,
  },
  title: {
    margin: 0,
    fontFamily: 'Lato',
    fontSize: 16,
    color: colorAiryBlue,
  },
});
