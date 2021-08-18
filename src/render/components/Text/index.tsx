import React from 'react';
import {StyleSheet} from 'react-native';

//import Linkify from 'linkifyjs/react';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
};

//https://www.npmjs.com/package/react-native-hyperlink

export const Text = ({text, fromContact}: TextRenderProps) => (
  <Linkify
    tagName="div"
    className={`${fromContact ? styles.contactContent : styles.memberContent}`}
    options={{
      defaultProtocol: 'https',
      className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
    }}>
    {text}
  </Linkify>
);


const styles = StyleSheet.create({
  contactContent: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  memberContent: {
    flex: 0.5,
    backgroundColor: 'blue'
  },
  messageLink: {
  backgroundColor: 'blue'
},
contactContent: {
  background: var(--color-background-blue);
  color: var(--color-text-contrast);
}, 
memberContent: {
  background: var(--color-airy-blue);
  color: white;
}
});
