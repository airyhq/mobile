//Button template Facebook

export const ButtonAttachmentSchema = {
  name: 'ButtonAttachment',
  properties: {
    type: 'string',
    payload: 'ButtonPayload',
  },
};

export const ButtonPayloadSchema = {
  name: 'ButtonPayload',
  properties: {
    text: 'string?',
    template_type: 'string',
    buttons: 'Button[]',
  },
};

export const ButtonSchema = {
  name: 'Button',
  properties: {
    type: 'string',
    url: 'string?',
    title: 'string?',
    payload: 'string?',
  },
};
