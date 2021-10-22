import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {CommandUnion} from '../../../../props';
import {Media} from './Media';
import {RichCardSuggestion, MediaHeight} from '../../googleModel';
import {
  colorLightGray,
  colorTemplateHightlight,
  colorContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';

export type Media = {
  height: MediaHeight;
  contentInfo: {
    altText?: string;
    fileUrl: string;
    forceRefresh: boolean;
  };
};

export type RichCardRenderProps = {
  title?: string;
  description?: string;
  suggestions: RichCardSuggestion[];
  media: Media;
  cardWidth?: string;
  commandCallback?: (command: CommandUnion) => void;
};

export const RichCard = ({
  title,
  description,
  suggestions,
  media,
  cardWidth,
  commandCallback,
}: RichCardRenderProps) => {
  const clickSuggestion = (suggestion: RichCardSuggestion) => {
    if (suggestion.reply) {
      commandCallback &&
        commandCallback({
          type: 'suggestedReply',
          payload: {
            text: suggestion.reply.text,
            postbackData: suggestion.reply.postbackData,
          },
        });
    } else if (suggestion.action) {
      commandCallback &&
        commandCallback({
          type: 'suggestedReply',
          payload: {
            text: suggestion.action.text,
            postbackData: suggestion.action.postbackData,
          },
        });
      if (suggestion.action.openUrlAction?.url) {
        window.open(suggestion.action.openUrlAction.url, '_blank', 'noopener');
      } else if (suggestion.action.dialAction?.phoneNumber) {
        window.open(
          `tel:${suggestion.action.dialAction.phoneNumber}`,
          '_blank',
          'noopener',
        );
      }
    }
  };

  const size = () => {
    if (cardWidth === 'SHORT') {
      return styles.small;
    } else {
      return styles.big;
    }
  };

  return (
    <>
      <View style={{...styles.richCardContainer, ...{size}}}>
        <View style={styles.mediaContainer}>
          <Media
            height={media.height}
            fileUrl={media.contentInfo.fileUrl}
            altText={media.contentInfo.altText}
          />
        </View>
        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion: RichCardSuggestion, idx: number) => (
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => {
                  clickSuggestion(suggestion);
                }}
                key={idx}>
                <Text>
                  {suggestion.reply
                    ? suggestion.reply.text
                    : suggestion.action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  richCardContainer: {
    width: '100%',
    maxWidth: 280,
    height: 'auto',
    marginTop: 5,
    borderWidth: 1,
    borderColor: colorLightGray,
    borderRadius: 16,
    backgroundColor: colorTemplateHightlight,
  },
  mediaContainer: {
    width: '100%',
    maxWidth: 280,
    height: 'auto',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 16,
    color: colorContrast,
    letterSpacing: 0,
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Lato',
    fontSize: 16,
    color: 'black',
    letterSpacing: 0,
    lineHeight: 24,
    width: '80%',
  },
  suggestionsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  suggestionButton: {
    height: 40,
    width: 'auto',
    maxWidth: 250,
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 12,
    alignItems: 'center',
    fontFamily: 'Lato',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colorLightGray,
    backgroundColor: colorTemplateHightlight,
    color: colorAiryBlue,
  },
  small: {
    width: 136,
  },
  big: {
    width: 280,
  },
});
