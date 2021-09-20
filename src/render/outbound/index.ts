import {FacebookMapper} from './facebook';
import {ChatpluginMapper} from './chatplugin';
import {GoogleMapper} from './google';
import {TwilioMapper} from './twilio';
import {ViberMapper} from './viber';
import {Source} from '../../model';

export const getOutboundMapper = (source: string) => {
  switch (source) {
    case Source.facebook:
    case Source.instagram:
      return new FacebookMapper();
    case Source.google:
      return new GoogleMapper();
    case Source.chatplugin:
      return new ChatpluginMapper();
    case Source.twilioSms:
    case Source.twilioWhatsapp:
      return new TwilioMapper();
    case Source.viber:
      return new ViberMapper();
    default: {
      console.error('Unknown source ', source);
    }
  }
};
