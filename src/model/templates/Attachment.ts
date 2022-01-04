export const AttachmentSchema = {
  name: 'Attachment',
  properties: {
    type: 'string?',
    payload: 'AttachmentPayload',
    title: 'string?',
    url: 'string?',
  },
};

export const AttachmentPayloadSchema = {
  name: 'AttachmentPayload',
  properties: {
    title: 'string?',
    url: 'string?',
  },
};
