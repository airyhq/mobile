import React from 'react';
import {StyleSheet} from 'react-native';
import {Carousel} from '../../../../../componentsLib/general/Carousel';
import {Media} from '../RichCard';
import {RichCard} from '../RichCard';
import {RichCardSuggestion} from '../../chatPluginModel';
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
          <div key={idx} style={styles.richCard}>
            <RichCard
              title={card.title}
              description={card.description}
              media={card.media}
              suggestions={card.suggestions}
              cardWidth={cardWidth}
              commandCallback={props.commandCallback}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  richCard: {
    paddingRight: 5,
  },
});
