//RichCardCarousel Realm Schema
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
