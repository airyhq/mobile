export const AttachmentSchema = {
  name: 'Attachment',
  properties: {
    type: 'string',
    payload: 'AttachmentPayload',
  },
};

export const AttachmentPayloadSchema = {
  name: 'AttachmentPayload',
  properties: {
    title: 'string?',
    url: 'string?',
  },
};
