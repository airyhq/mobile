import {getAttachmentType} from '../../services/types/mediaAttachments';
import {OutboundMapper} from './mapper';

export class ChatpluginMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    const mediaType = getAttachmentType(mediaUrl, 'chatplugin');

    return {
      attachment: {
        type: mediaType,
        payload: {
          url: mediaUrl,
        },
      },
    };
  }
}
