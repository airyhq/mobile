import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import RightArrow from '../../../assets/images/icons/rightArrow.svg';
import LeftArrow from '../../../assets/images/icons/leftArrow.svg';
import {colorTextGray} from '../../../assets/colors';

export const Carousel = ({children, cardWidth}) => {
  const carouselChildren = useRef(null);
  const buttonLeft = useRef(null);
  const buttonRight = useRef(null);
  const [setScrollViewTotalWidth] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [richCardWidth, setRichCardWidth] = useState(0);

  useEffect(() => {
    if (cardWidth === 'SHORT') {
      setScrollDistance(136);
      setRichCardWidth(136);
    } else {
      setScrollDistance(320);
      setRichCardWidth(320);
    }
  }, [cardWidth]);

  useEffect(() => {
    console.log('scrollDistance', scrollDistance);
  }, [scrollDistance]);

  const scrollLeft = () => {
    if (carouselChildren.current && scrollDistance > 0) {
      setScrollDistance(distance => distance - richCardWidth);
      carouselChildren.current.scrollTo({
        x: scrollDistance,
        y: 0,
        animated: true,
      });
    }
  };

  const scrollRight = () => {
    if (carouselChildren.current) {
      setScrollDistance(distance => distance + richCardWidth);
      carouselChildren.current.scrollTo({
        x: scrollDistance,
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal={true}
        style={[
          styles.carouselChildren,
          {width: richCardWidth, height: 'auto'},
        ]}
        ref={carouselChildren}
        onContentSizeChange={width => setScrollViewTotalWidth(width)}>
        {children}
      </ScrollView>
      {scrollDistance > richCardWidth && (
        <TouchableOpacity
          accessibilityLabel="Left Arrow button"
          ref={buttonLeft}
          style={styles.buttonLeft}
          onPress={scrollLeft}>
          <LeftArrow width={24} height={24} fill="#167FAB" />
        </TouchableOpacity>
      )}
      {scrollDistance <= richCardWidth * children.length && (
        <TouchableOpacity
          accessibilityLabel="Right Arrow button"
          ref={buttonRight}
          style={styles.buttonRight}
          onPress={scrollRight}>
          <RightArrow width={24} height={24} fill="#167FAB" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    width: '100%',
    height: 'auto',
    backgroundColor: 'yellow',
    position: 'relative',
  },
  carouselChildren: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonScroll: {
    width: 30,
    height: 40,
    top: 20,
    borderWidth: 0,
    backgroundColor: '#ffffff',
  },
  buttonLeft: {
    position: 'absolute',
    top: '50%',
    width: 30,
    height: 40,
    borderWidth: 0,
    backgroundColor: 'red',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRight: {
    position: 'absolute',
    top: '50%',
    width: 30,
    height: 40,
    borderWidth: 0,
    backgroundColor: 'blue',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollButton: {
    width: 24,
  },
  messageTime: {
    color: colorTextGray,
  },
});
