export const SimpleAttachmentSchema = {
  name: 'SimpleAttachment',
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
