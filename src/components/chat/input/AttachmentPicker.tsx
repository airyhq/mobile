import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colorTextGray} from '../../../assets/colors';
import ImageIcon from '../../../assets/images/icons/attachmentImage.svg';
import AttachmentIcon from '../../../assets/images/icons/image.svg';
import FileIcon from '../../../assets/images/icons/attachmentFile.svg';
import ArrowIcon from '../../../assets/images/icons/arrowCircleRight.svg';
import {
  ATTACHMENT_BAR_ITEM_HEIGHT,
  ATTACHMENT_BAR_ITEM_WIDTH,
  ATTACHMENT_BAR_ITEM_PADDING,
  SupportedType,
} from './config';

type AttachmentBarProps = {
  attachmentTypes: SupportedType[];
  attachmentBarWidth: number;
  extendedAttachments: boolean;
  setExtendedAttachments: (extended: boolean) => void;
};

export const AttachmentPicker = (props: AttachmentBarProps) => {
  const {
    attachmentTypes,
    attachmentBarWidth,
    extendedAttachments,
    setExtendedAttachments,
  } = props;

  const Attachments = () => {
    return (
      <>
        {attachmentTypes.includes(SupportedType.photo) && (
          <TouchableOpacity style={styles.icons}>
            <ImageIcon
              height={ATTACHMENT_BAR_ITEM_HEIGHT}
              width={ATTACHMENT_BAR_ITEM_WIDTH}
              fill={colorTextGray}
            />
          </TouchableOpacity>
        )}
        {attachmentTypes.includes(SupportedType.template) && (
          <TouchableOpacity style={styles.icons}>
            <AttachmentIcon
              height={ATTACHMENT_BAR_ITEM_HEIGHT}
              width={ATTACHMENT_BAR_ITEM_WIDTH}
              fill={colorTextGray}
            />
          </TouchableOpacity>
        )}
        {attachmentTypes.includes(SupportedType.file) && (
          <TouchableOpacity style={styles.icons}>
            <FileIcon
              height={ATTACHMENT_BAR_ITEM_HEIGHT}
              width={ATTACHMENT_BAR_ITEM_WIDTH}
              fill={colorTextGray}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <>
      {extendedAttachments ? (
        <View style={[styles.container, {width: attachmentBarWidth}]}>
          <Attachments />
        </View>
      ) : (
        <View
          style={[
            styles.extendIcon,
            {width: ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING},
          ]}>
          <TouchableOpacity
            onPress={() => setExtendedAttachments(!extendedAttachments)}>
            <ArrowIcon height={30} width={30} fill={colorTextGray} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    height: 33,
    marginRight: 6,
    marginLeft: 12,
  },
  extendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 33,
    marginRight: 6,
    marginLeft: 12,
  },
  icons: {
    marginLeft: 6,
    marginRight: 6,
  },
});
