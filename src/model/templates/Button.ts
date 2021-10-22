//Button template Facebook

export const ButtonAttachmentSchema = {
  name: 'ButtonAttachment',
  properties: {
    text: 'string',
    template_type: 'string',
    buttons: 'Button[]',
  },
};

export const ButtonSchema = {
  name: 'Button',
  properties: {
    type: 'string',
    url: 'string',
    title: 'string',
  },
};

