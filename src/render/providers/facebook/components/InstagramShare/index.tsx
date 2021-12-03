import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';

interface InstagramShareProps {
  url: string;
  fromContact?: boolean;
}

const failedUrls = [];

export const Share = ({url, fromContact}: InstagramShareProps) => {
  const [imageFailed, setImageFailed] = useState(failedUrls.includes(url));

  useEffect(() => {
    setImageFailed(failedUrls.includes(url));
  }, [url]);

  const loadingFailed = () => {
    failedUrls.push(url);
    setImageFailed(true);
  };

  return (
    <>
      <View
        style={[
          styles.bubble,
          fromContact ? styles.contactContent : styles.memberContent,
        ]}>
        <View style={styles.container}>
          <Text style={styles.shareText}>Shared Post</Text>
        </View>
      </View>

      {imageFailed ? (
        <Text style={styles.previewUnavaiblable}>Post unavaiblable</Text>
      ) : (
        <Image
          style={styles.sharedPost}
          source={{
            uri: url,
          }}
          onError={() => loadingFailed()}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    marginTop: 5,
  },
  contactContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    alignItems: 'baseline',
  },
  memberContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorAiryBlue,
    color: 'white',
    alignItems: 'baseline',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    color: colorTextContrast,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  icon: {
    marginLeft: 4,
    marginRight: 0,
    width: 15,
    height: 15,
  },
  sharedPost: {
    borderRadius: 22,
    width: 150,
    height: 150,
  },
  previewUnavaiblable: {
    fontStyle: 'italic',
  },
});
