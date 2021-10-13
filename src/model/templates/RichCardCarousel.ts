import {ContentMessage} from '../Message';

export interface RichCardCarousel {
  carouselCard: {
    cardWidth: string;
    cardContents: [
      {
        title: string;
        description: string;
        suggestions: [
          {
            reply: {
              text: string;
              postbackData: string;
            };
          },
        ];
        media: {
          height: string;
          contentInfo: {
            fileUrl: string;
            forceRefresh: boolean;
          };
        };
      },
      {
        title: string;
        description: string;
        suggestions: [
          {
            reply: {
              text: string;
              postbackData: string;
            };
          },
        ];
        media: {
          height: string;
          contentInfo: {
            fileUrl: string;
            forceRefresh: boolean;
          };
        };
      },
    ];
  };
}

export interface RichCardCarouselContent extends ContentMessage {
  richCardCarousel: RichCardCarousel;
}

//RichCardCarousel Schema
export const RichCardCarouselSchema = {
  name: 'RichCardCarousel',
  properties: {
    carouselCard: 'CarouselCard',
  },
};

export const CarouselCardSchema = {
  name: 'CarouselCard',
  properties: {
    cardWidth: 'string',
    cardContents: 'CardContent[]',
  },
};
