import {Source} from '../../model';
import {getAttachmentType} from '../../services/types/mediaAttachments';
import {OutboundMapper} from './mapper';

export class FacebookMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    const mediaType = getAttachmentType(mediaUrl, Source.facebook);

    return {
      attachment: {
        type: mediaType,
        payload: {
          is_reusable: true,
          url: mediaUrl,
        },
      },
    };
  }
}
