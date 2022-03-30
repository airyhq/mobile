//QuickReplies ChatPlugin
export const QuickRepliesChatPluginSchema = {
  name: 'QuickRepliesChatPlugin',
  properties: {
    text: 'string?',
    attachment: 'Attachment?',
    attachments: {
      type: 'list',
      objectType: 'Attachment',
    },
    quickReplies: 'QuickRepliesChatPluginContent[]',
  },
};

export const QuickRepliesChatPluginContentSchema = {
  name: 'QuickRepliesChatPluginContent',
  properties: {
    content_type: 'string',
    title: 'string',
    payload: 'QuickReplyChatPluginCommand?',
    image_url: 'string?',
  },
};

export const QuickReplyChatPluginCommandSchema = {
  name: 'QuickReplyChatPluginCommand',
  properties: {
    type: 'string',
    text: 'string',
    postbackData: 'string',
  },
};
