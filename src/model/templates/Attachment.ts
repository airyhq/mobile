export const AttachmentSchema = {
  name: 'Attachment',
  properties: {
    payload: 'AttachmentPayload',
  },
};

export const AttachmentsSchema = {
  name: 'Attachments',
  properties: {
    payload: 'AttachmentPayload[]',
  },
};

export const AttachmentPayloadSchema = {
  name: 'AttachmentPayload',
  properties: {
    title: 'string?',
    url: 'string?',
  },
};



