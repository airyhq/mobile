import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {colorTextGray} from '../assets/colors';
import ImageIcon from '../assets/images/icons/attachmentImage.svg';
import AttachmentIcon from '../assets/images/icons/image.svg';
import FileIcon from '../assets/images/icons/attachmentFile.svg';
import ArrowIcon from '../assets/images/icons/arrowCircleRight.svg';
import {Source} from '../model/Channel';

type AttachmentBarProps = {
  source: string;
  extended: boolean | null;
  setExtended: (extended: boolean) => void;
  width: any;
};

enum SupportedType {
  photo = 'photo',
  file = 'file',
  template = 'template',
}

export const AttachmentBar = (props: AttachmentBarProps) => {
  const {source, extended, setExtended, width} = props;
  const attachmentArray = [];
  const supportedArray = [];
  const itemWidthHeight = 24;
  const padding = 12;
  const [items, setItems] = useState(0);
  const [attachmentBarWidth, setAttachmentBarWidth] = useState(
    items * itemWidthHeight + padding,
  );

  useEffect(() => {
    setItems(attachmentArray.length);
    setAttachmentBarWidth(items * (itemWidthHeight + padding));
    width(attachmentBarWidth);
  }, [attachmentArray, extended]);

  const attachmentSupport = () => {
    switch (source) {
      case Source.facebook:
        attachmentArray.push(
          SupportedType.photo,
          SupportedType.template,
          SupportedType.file,
        );
        break;
      case Source.google:
        attachmentArray.push(SupportedType.file, SupportedType.photo);
        break;
      case Source.chatplugin:
        attachmentArray.push(SupportedType.template, SupportedType.file);
        break;
      case Source.viber:
        attachmentArray.push(SupportedType.template);
        break;
      case Source.instagram:
        attachmentArray.push(SupportedType.template);
        break;
      case Source.unknown:
        attachmentArray.push(SupportedType.template);
        break;
      case Source.twilioSms:
      case Source.twilioWhatsapp:
        attachmentArray.push(SupportedType.template);
        break;
    }

    if (attachmentArray.includes(SupportedType.photo)) {
      supportedArray.push(
        <TouchableOpacity style={styles.icons}>
          <ImageIcon
            height={itemWidthHeight}
            width={itemWidthHeight}
            fill={colorTextGray}
          />
        </TouchableOpacity>,
      );
    }

    if (attachmentArray.includes(SupportedType.template)) {
      supportedArray.push(
        <TouchableOpacity style={styles.icons}>
          <AttachmentIcon
            height={itemWidthHeight}
            width={itemWidthHeight}
            fill={colorTextGray}
          />
        </TouchableOpacity>,
      );
    }

    if (attachmentArray.includes(SupportedType.file)) {
      supportedArray.push(
        <TouchableOpacity style={styles.icons}>
          <FileIcon
            height={itemWidthHeight}
            width={itemWidthHeight}
            fill={colorTextGray}
          />
        </TouchableOpacity>,
      );
    }
  };

  attachmentSupport();

  return (
    <>
      {extended ? (
        <View style={[styles.container, {width: attachmentBarWidth}]}>
          {supportedArray}
        </View>
      ) : (
        <View style={[styles.extendIcon, {width: itemWidthHeight + padding}]}>
          <TouchableOpacity onPress={() => setExtended(!!extended)}>
            <ArrowIcon height={30} width={30} fill={colorTextGray} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    height: 33,
    marginRight: 6,
    marginLeft: 12,
  },
  extendIcon: {
    backgroundColor: 'purple',
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
