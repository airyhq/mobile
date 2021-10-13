import React from 'react';
import {StyleSheet, View} from 'react-native';
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

  console.log('cardWidth', cardWidth);

  return (
    <Carousel cardWidth={cardWidth}>
      {cardContents.map((card: Card, idx: number) => {
        return (
          <View key={idx} style={styles.richCard}>
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

const styles = StyleSheet.create({
  richCard: {
    paddingRight: 5,
  },
});
