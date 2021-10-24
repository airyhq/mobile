//Generic template Schema
export const GenericAttachmentSchema = {
  name: 'GenericAttachment',
  properties: {
    type: 'string',
    payload: 'GenericPayload',
  },
};

export const GenericPayloadSchema = {
  name: 'GenericPayload',
  properties: {
    text: 'string?',
    template_type: 'string',
    elements: 'Element[]',
  },
};

export const ElementSchema = {
  name: 'Element',
  properties: {
    title: 'string',
    subtitle: 'string?',
    image_url: 'string?',
    default_action: 'DefaultAction?',
    buttons: 'Button[]',
  },
};

export const DefaultActionSchema = {
  name: 'DefaultAction',
  properties: {
    type: 'string',
    url: 'string?',
  },
};
