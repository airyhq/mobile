//QuickReplies Facebook Realm Schema
export const QuickRepliesFacebookSchema = {
  name: 'QuickRepliesFacebook',
  properties: {
    text: 'string?',
    attachment: 'SimpleAttachment?',
    quickReplies: 'QuickRepliesFacebookContent[]',
  },
};

export const QuickRepliesFacebookContentSchema = {
  name: 'QuickRepliesFacebookContent',
  properties: {
    content_type: 'string',
    title: 'string',
    payload: 'string',
    image_url: 'string?',
  },
};