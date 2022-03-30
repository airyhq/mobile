import React from 'react';
import {View} from 'react-native';
import {Carousel} from '../../../../../componentsLib/general/Carousel';
import {Media, RichCard} from '../RichCard';
import {RichCardSuggestion} from '../../googleModel';
import {CommandUnion} from '../../../../props';

type Card = {
  id?: string;
  title?: string;
  description?: string;
  media: Media;
  suggestions: RichCardSuggestion[];
};

export type RichCardCarouselRenderProps = {
  cardWidth: string;
  cardContents: [Card];
  commandCallback?: (command: CommandUnion) => void;
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth} = props;

  return (
    <Carousel>
      {cardContents.map((card: Card, idx: number) => {
        return (
          <View key={idx} style={{paddingRight: 5}}>
            <RichCard
              title={card.title}
              description={card.description}
              media={card.media}
              suggestions={card.suggestions}
              cardWidth={cardWidth}
              commandCallback={props.commandCallback}
            />
          </View>
        );
      })}
    </Carousel>
  );
};
