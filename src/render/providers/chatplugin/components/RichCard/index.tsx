import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {CommandUnion} from '../../../../props';
import {RichCardSuggestion} from '../../chatPluginModel';
import {
  colorLightGray,
  colorTemplateHightlight,
  colorContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';
import {MediaHeight} from '../../chatPluginModel';
import {ImageWithFallback} from '../../../../components/ImageWithFallback';

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

  const getHeight = (height: MediaHeight): any => {
    switch (height) {
      case MediaHeight.short:
        return styles.short;
      case MediaHeight.medium:
        return styles.medium;
      case MediaHeight.tall:
        return styles.tall;
      default:
        return styles.medium;
    }
  };

  return (
    <>
      <View style={{...styles.richCardContainer, ...{size}}}>
        <View style={styles.mediaContainer}>
          <ImageWithFallback
            src={media.contentInfo.fileUrl}
            alt={media.contentInfo.altText ?? 'richCard template'}
            imageStyle={{...styles.mediaImage, ...getHeight(media.height)}}
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
                {suggestion.reply?.text && (
                  <Text> {suggestion.reply?.text} </Text>
                )}
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
    height: 'auto',
    width: '100%',
    borderWidth: 1,
    borderColor: colorLightGray,
    borderRadius: 16,
    backgroundColor: colorTemplateHightlight,
    marginTop: 5,
  },
  mediaContainer: {
    width: '100%',
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
  },
  suggestionsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  suggestionButton: {
    fontFamily: 'Lato',
    fontSize: 16,
    overflow: 'hidden',
    height: 40,
    width: 'auto',
    maxWidth: 250,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorLightGray,
    borderRadius: 4,
    backgroundColor: colorTemplateHightlight,
    color: colorAiryBlue,
  },
  small: {
    width: 136,
  },
  big: {
    width: 320,
  },
  mediaImage: {
    width: 'auto',
    height: 'auto',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tall: {
    height: 210,
  },
  medium: {
    height: 168,
  },
  short: {
    height: 112,
  },
});
