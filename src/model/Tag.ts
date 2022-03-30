export type TagColor = 'tag-blue' | 'tag-red' | 'tag-green' | 'tag-purple';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

export const TagSchema = {
  name: 'Tag',
  properties: {
    id: 'string',
    name: 'string',
    color: 'string',
  },
};
