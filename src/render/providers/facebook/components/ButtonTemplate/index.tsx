import React from 'react';
import {Buttons} from '../Buttons';
import {StyleSheet, View, Text} from 'react-native';
import {colorTemplateGray} from '../../../../../assets/colors';
import {ButtonTemplate as ButtonTemplateModel} from '../../facebookModel';

type ButtonTemplateRendererProps = {
  template: ButtonTemplateModel;
};

export const ButtonTemplate = ({template}: ButtonTemplateRendererProps) => (
  <View style={styles.wrapper}>
    <View style={styles.template}>
      <Text style={styles.templateText}>{template.text}</Text>
      <Buttons buttons={template.buttons} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
  },
  template: {
    backgroundColor: colorTemplateGray,
    borderRadius: 16,
    width: 320,
    padding: 16,
  },
  templateText: {
    fontFamily: 'Lato',
    fontSize: 16,
  },
});
