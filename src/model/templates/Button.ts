//Button template Facebook
export const ButtonSchema = {
  name: 'Button',
  properties: {
    type: 'string',
    url: 'string',
    title: 'string',
  },
};

export const ButtonTemplateAttachmentSchema = {
  name: 'ButtonTemplateAttachment',
  properties: {
    text: 'string',
    template_type: 'string',
    buttons: 'Button[]',
  },
};
