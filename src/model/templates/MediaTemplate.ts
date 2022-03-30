//Media Template Facebook
export const MediaAttachmentSchema = {
  name: 'MediaAttachment',
  properties: {
    type: 'string',
    payload: 'MediaAttachmentPayload',
  },
};

export const MediaAttachmentPayloadSchema = {
  name: 'MediaAttachmentPayload',
  properties: {
    template_type: 'string',
    elements: 'MediaTemplate[]',
  },
};

export const MediaTemplateSchema = {
  name: 'MediaTemplate',
  properties: {
    type: 'string?',
    media_type: 'string',
    url: 'string?',
    attachment_id: 'string?',
    buttons: 'Button[]',
  },
};
