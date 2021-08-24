import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {colorTextGray} from '../assets/colors';
import ImageIcon from '../assets/images/icons/attachmentImage.svg';
import AttachmentIcon from '../assets/images/icons/image.svg';
import FileIcon from '../assets/images/icons/attachmentFile.svg';
import ArrowIcon from '../assets/images/icons/arrowCircleRight.svg';

type AttachmentBarProps = {
  extended: boolean | null;
  setExtended: (extended: boolean) => void;
};

export const AttachmentBar = (props: AttachmentBarProps) => {
  const {extended, setExtended} = props;

  return (
    <>
      {extended ? (
        <View style={styles.extendedIcons}>
          <TouchableOpacity>
            <ImageIcon height={24} width={24} fill={colorTextGray} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AttachmentIcon height={24} width={24} fill={colorTextGray} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FileIcon height={24} width={24} fill={colorTextGray} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.extendIcon}>
          <TouchableOpacity onPress={() => setExtended(!!extended)}>
            <ArrowIcon height={30} width={30} fill={colorTextGray} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  extendedIcons: {
    flexDirection: 'row',
    width: width * 0.32,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 33,
  },
  extendIcon: {
    width: width * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 33,
    backgroundColor: 'white',
  },
});
