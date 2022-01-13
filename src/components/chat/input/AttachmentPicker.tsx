import React from 'react';
import {Platform, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colorAiryBlue, colorTextGray} from '../../../assets/colors';
import AttachmentImageIcon from '../../../assets/images/icons/attachmentImage.svg';
import AttachmentTemplateIcon from '../../../assets/images/icons/attachmentTemplate.svg';
import AttachmentFileIcon from '../../../assets/images/icons/attachmentFile.svg';
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
            <AttachmentImageIcon
              height={ATTACHMENT_BAR_ITEM_HEIGHT}
              width={ATTACHMENT_BAR_ITEM_WIDTH}
              color={colorAiryBlue}
            />
          </TouchableOpacity>
        )}
        {attachmentTypes.includes(SupportedType.template) && (
          <TouchableOpacity style={styles.icons}>
            <View style={{padding: 2}}>
              <AttachmentTemplateIcon
                height={ATTACHMENT_BAR_ITEM_HEIGHT - 4}
                width={ATTACHMENT_BAR_ITEM_WIDTH - 4}
                color={colorAiryBlue}
              />
            </View>
          </TouchableOpacity>
        )}
        {attachmentTypes.includes(SupportedType.file) && (
          <TouchableOpacity style={styles.icons}>
            <AttachmentFileIcon
              height={ATTACHMENT_BAR_ITEM_HEIGHT}
              width={ATTACHMENT_BAR_ITEM_WIDTH}
              color={colorAiryBlue}
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
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'android' ? 42 : 33,
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
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
