import {Source} from '../../../model';
import {Platform} from 'react-native';

export const ATTACHMENT_BAR_ITEM_WIDTH = Platform.OS === 'ios' ? 24 : 28;
export const ATTACHMENT_BAR_ITEM_HEIGHT = Platform.OS === 'ios' ? 24 : 28;
export const ATTACHMENT_BAR_ITEM_PADDING = 12;

export enum SupportedType {
  photo = 'photo',
  file = 'file',
  template = 'template',
}

export const getAttachments = (source: Source): SupportedType[] => {
  const attachmentArray: SupportedType[] = [];
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
  return attachmentArray;
};
