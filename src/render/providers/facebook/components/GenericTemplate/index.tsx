import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {Carousel} from '../../../../../componentsLib';
import {GenericTemplate as GenericTemplateModel} from '../../facebookModel';
import {ImageWithFallback} from '../../../../components/ImageWithFallback';
import {Buttons} from '../Buttons';
import {colorTemplateGray} from '../../../../../assets/colors';

type GenericTemplateRendererProps = {
  template: GenericTemplateModel;
};

export const GenericTemplate = ({template}: GenericTemplateRendererProps) => {
  return (
    <Carousel>
      {template.elements.map((element, idx) => {
        return (
          <View key={`template-${idx}`} style={styles.template}>
            {element.image_url && (
              <ImageWithFallback
                imageStyle={styles.templateImage}
                src={element.image_url}
              />
            )}
            <View style={styles.innerTemplate}>
              <Text style={styles.templateTitle}>{element.title}</Text>
              <Text style={styles.templateSubtitle}>{element.subtitle}</Text>
              <Buttons buttons={element.buttons} />
            </View>
          </View>
        );
      })}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  template: {
    width: '100%',
    height: 'auto',
    maxWidth: 280,
    marginLeft: 8,
    backgroundColor: colorTemplateGray,
    borderRadius: 16,
    flexShrink: 0,
  },
  templateTitle: {
    fontWeight: '700',
    paddingBottom: 5,
  },
  templateSubtitle: {
    fontWeight: '400',
  },
  templateImage: {
    width: '100%',
    maxWidth: 280,
    height: 168,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  innerTemplate: {
    paddingTop: 8,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
});
