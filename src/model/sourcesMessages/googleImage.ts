export const GoogleImageSchema = {
  name: 'GoogleImage',
  properties: {
    contentInfo: 'ImageInfo',
  },
};

export const ImageInfoSchema = {
  name: 'ImageInfo',
  properties: {
    fileUrl: 'string',
    altText: 'string',
  },
};
