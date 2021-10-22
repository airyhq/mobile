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
      {template.elements.map((element, idx) => (
        <View key={`template-${idx}`} style={styles.template}>
          {element.image_url?.length && (
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
      ))}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  template: {
    backgroundColor: colorTemplateGray,
    borderRadius: 16,
    width: 320,
    flexShrink: 0,
    marginLeft: 8,
  },
  templateTitle: {
    fontWeight: '700',
  },
  templateSubtitle: {
    fontWeight: '400',
  },
  templateImage: {
    width: '100%',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },
  innerTemplate: {
    paddingTop: 8,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
});
