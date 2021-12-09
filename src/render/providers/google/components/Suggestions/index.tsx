import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Pressable,
  View,
  Text,
  Linking,
} from 'react-native';

import {SuggestionsUnion} from '../../googleModel';
import {TextComponent} from '../../../../components/Text';
import {ImageComponent} from '../../../../components/ImageComponent';

import LinkIcon from '../../../../../assets/images/icons/link.svg';
import PhoneIcon from '../../../../../assets/images/icons/phone.svg';
import {
  colorDarkElementsGray,
  colorTemplateHightlight,
  colorTextContrast,
  colorLightGray,
} from '../../../../../assets/colors';

type SuggestionsRendererProps = {
  text?: string;
  fallback?: string;
  fromContact?: boolean;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: any;
};

//SuggestionsUnion[];

export const Suggestions = ({
  text,
  fallback,
  image,
  suggestions,
  fromContact,
}: SuggestionsRendererProps) => {
  console.log('suggestions compo', suggestions?.[0]?.action);

  return (
    <View style={styles.suggestionsWrapper}>
      {image && (
        <ImageComponent imageUrl={image.fileUrl} altText={image.altText} />
      )}

      {(text || fallback) && (
        <TextComponent text={text ?? fallback} fromContact={fromContact} />
      )}

      <View style={styles.suggestionsContainer}>
        {(suggestions as SuggestionsUnion[]).map(elem => {
          if ('reply' in elem && elem?.reply !== null) {
            return (
              <TouchableHighlight
                key={elem.reply.text}
                style={styles.touchableHighlightSuggestion}>
                <Text key={elem.reply.text} style={styles.title}>
                  {elem.reply.text}
                </Text>
              </TouchableHighlight>
            );
          }

          if ('action' in elem && elem?.action !== null) {
            return (
              <>
                <TouchableHighlight
                  key={elem.action.text}
                  style={styles.touchableHighlightSuggestion}>
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
                </TouchableHighlight>
              </>
            );
          }

          if (
            'authenticationRequest' in elem &&
            elem?.authenticationRequest !== null
          ) {
            return (
              <TouchableHighlight
                key={elem.authenticationRequest.oauth.clientId}
                style={styles.touchableHighlightSuggestion}>
                <Text
                  key={elem.authenticationRequest.oauth.clientId}
                  style={styles.title}>
                  Authenticate with Google
                </Text>
              </TouchableHighlight>
            );
          }

          if ('liveAgentRequest' in elem && elem?.liveAgentRequest !== null) {
            return (
              <TouchableHighlight
                key={Math.floor(Math.random() * 50)}
                style={styles.touchableHighlightSuggestion}>
                <Text key={Math.floor(Math.random() * 50)} style={styles.title}>
                  Message a live agent on Google&apos;s Business Messages
                </Text>
              </TouchableHighlight>
            );
          }
        })}
        {suggestions &&
          suggestions?.[0] &&
          ('action' in suggestions[0] !== null ||
            'reply' in suggestions[0] !== null ||
            'authenticationRequest' in suggestions?.[0] !== null ||
            'liveAgentRequest' in suggestions?.[0] !== null) && (
            <Pressable
              style={({pressed}) => [
                pressed
                  ? styles.pressedHoverTextContainer
                  : styles.hoverTextContainer,
              ]}>
              {() => (
                <Text style={styles.hoverText}>
                  {' '}
                  action cannot be triggered
                </Text>
              )}
            </Pressable>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsWrapper: {
    width: 'auto',
    marginTop: 5,
  },
  suggestionsContainer: {
    position: 'relative',
    marginTop: 5,
  },
  touchableHighlightSuggestion: {
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
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
    flexWrap: 'wrap',
    maxWidth: '90%',
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
  hoverTextContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 6,
    paddingRight: 2,
    backgroundColor: colorLightGray,
    opacity: 0,
  },
  pressedHoverTextContainer: {
    opacity: 1,
  },
  hoverText: {
    fontFamily: 'Lato',
    fontSize: 14,
    color: colorTextContrast,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
