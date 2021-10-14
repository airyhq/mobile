import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import RightArrow from '../../../assets/images/icons/rightArrow.svg';
import LeftArrow from '../../../assets/images/icons/leftArrow.svg';

export const Carousel = ({children, cardWidth, paddingRight}) => {
  const carouselChildren = useRef(null);
  const [richCardWidth, setRichCardWidth] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [rightButton, setRightButton] = useState(true);

  useEffect(() => {
    if (cardWidth === 'SHORT') {
      setRichCardWidth(136);
    } else {
      setRichCardWidth(285);
    }
  }, [cardWidth]);

  const scrollLeft = () => {
    carouselChildren.current.scrollTo({
      x: scrollDistance - richCardWidth,
      y: 0,
      animated: true,
    });
  };

  const scrollRight = () => {
    if (carouselChildren.current) {
      carouselChildren.current.scrollTo({
        x: scrollDistance + richCardWidth,
        y: 0,
        animated: true,
      });
    }
  };

  const isCloseToScrollViewEnd = event => {
    return (
      event.layoutMeasurement.width + event.contentOffset.x >=
      event.contentSize.width - paddingRight * 3
    );
  };

  const handleScroll = (event: any) => {
    setScrollDistance(event.nativeEvent.contentOffset.x);
    isCloseToScrollViewEnd(event.nativeEvent);

    if (isCloseToScrollViewEnd(event.nativeEvent)) {
      setRightButton(false);
    } else if (!rightButton) {
      setRightButton(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        style={[
          styles.carouselChildren,
          {width: richCardWidth, height: 'auto'},
        ]}
        ref={carouselChildren}>
        {children}
      </ScrollView>

      {scrollDistance >= richCardWidth - paddingRight && (
        <TouchableOpacity
          accessibilityLabel="Left Arrow button"
          style={[styles.buttonScroll, styles.buttonLeft]}
          onPress={scrollLeft}>
          <LeftArrow width={24} height={24} fill="#167FAB" />
        </TouchableOpacity>
      )}

      {rightButton && (
        <TouchableOpacity
          accessibilityLabel="Right Arrow button"
          style={[styles.buttonScroll, styles.buttonRight]}
          onPress={scrollRight}>
          <RightArrow width={24} height={24} fill="#167FAB" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 320,
    height: 'auto',
    overflow: 'hidden',
    marginRight: 10,
    marginTop: 5,
  },
  carouselChildren: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonScroll: {
    width: 30,
    height: 40,
    position: 'absolute',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'white',
  },
  buttonLeft: {
    left: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  buttonRight: {
    right: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  scrollButton: {
    width: 24,
  },
});
