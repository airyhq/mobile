import React, {useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Animated,
} from 'react-native';

import {SuggestionsUnion} from '../../googleModel';
import {TextComponent} from '../../../../components/Text';
import {ImageComponent} from '../../../../components/ImageComponent';
import {
  Tooltip,
  TooltipArrowPosition,
} from '../../../../../componentsLib/general';

import LinkIcon from '../../../../../assets/images/icons/link.svg';
import PhoneIcon from '../../../../../assets/images/icons/phone.svg';
import {
  colorDarkElementsGray,
  colorTemplateHightlight,
  colorTextContrast,
} from '../../../../../assets/colors';

type SuggestionsRendererProps = {
  text?: string;
  fallback?: string;
  fromContact?: boolean;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestionsUnion[];
};

export const Suggestions = ({
  text,
  fallback,
  image,
  suggestions,
  fromContact,
}: SuggestionsRendererProps) => {
  const fadeAnimTooltip = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnimTooltip, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnimTooltip, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, 2000);
  };

  return (
    <View
      style={[
        styles.suggestionsWrapper,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      {image && (
        <ImageComponent imageUrl={image.fileUrl} altText={image.altText} />
      )}

      {(text || fallback) && (
        <TextComponent text={text ?? fallback} fromContact={fromContact} />
      )}

      <View
        style={[
          styles.suggestionsContainer,
          fromContact ? styles.contactContent : styles.memberContent,
        ]}>
        {(suggestions as SuggestionsUnion[]).map(elem => {
          if ('reply' in elem && elem?.reply !== null) {
            return (
              <TouchableOpacity
                key={elem.reply.text}
                style={styles.touchableSuggestion}
                onPressIn={fadeIn}>
                <Text key={elem.reply.text} style={styles.title}>
                  {elem.reply.text}
                </Text>
              </TouchableOpacity>
            );
          }

          if ('action' in elem && elem?.action !== null) {
            return (
              <>
                <TouchableOpacity
                  key={elem.action.text}
                  style={styles.touchableSuggestion}>
                  <View style={styles.actionContainer}>
                    {elem.action.openUrlAction ? (
                      <LinkIcon
                        style={styles.actionIcon}
                        fill={colorTextContrast}
                      />
                    ) : (
                      <PhoneIcon
                        style={styles.actionPhoneIcon}
                        fill={colorTextContrast}
                      />
                    )}
                    <Text
                      key={elem.action.text}
                      style={styles.title}
                      onPress={() =>
                        Linking.openURL(
                          elem.action.openUrlAction &&
                            elem.action.openUrlAction.url
                            ? elem.action.openUrlAction.url
                            : `tel: ${elem.action.dialAction?.phoneNumber}`,
                        )
                      }>
                      {elem.action.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            );
          }

          if (
            'authenticationRequest' in elem &&
            elem?.authenticationRequest !== null
          ) {
            return (
              <TouchableOpacity
                key={elem.authenticationRequest.oauth.clientId}
                style={styles.touchableSuggestion}
                onPressIn={fadeIn}>
                <Text
                  key={elem.authenticationRequest.oauth.clientId}
                  style={styles.title}>
                  Authenticate with Google
                </Text>
              </TouchableOpacity>
            );
          }

          if ('liveAgentRequest' in elem && elem?.liveAgentRequest !== null) {
            return (
              <TouchableOpacity
                key={Math.floor(Math.random() * 50)}
                style={styles.touchableSuggestion}
                onPressIn={fadeIn}>
                <Text key={Math.floor(Math.random() * 50)} style={styles.title}>
                  Message a live agent on GBM
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>

      <Animated.View
        style={[styles.tooltipContainer, {opacity: fadeAnimTooltip}]}>
        <Tooltip
          text="this action can only be triggered on GBM"
          arrowPosition={TooltipArrowPosition.bottom}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsWrapper: {
    width: 'auto',
    height: 'auto',
    marginTop: 5,
  },
  suggestionsContainer: {
    position: 'relative',
    width: 'auto',
    height: 'auto',
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'visible',
  },
  memberContent: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  contactContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  touchableSuggestion: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: colorDarkElementsGray,
    backgroundColor: colorTemplateHightlight,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 16,
    color: colorTextContrast,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    padding: 0,
  },
  actionPhoneIcon: {
    width: 25,
    height: 25,
    marginRight: 6,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    padding: 0,
  },
  tooltipContainer: {
    bottom: 50,
    right: 0,
    position: 'absolute',
  },
});
