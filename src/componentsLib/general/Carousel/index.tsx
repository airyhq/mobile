import React, {useCallback, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import RightArrow from '../../../assets/images/icons/rightArrow.svg';
import LeftArrow from '../../../assets/images/icons/leftArrow.svg';
import {colorTextGray} from '../../../assets/colors';

export const Carousel = ({children}) => {
  const carouselChildren = useRef(null);
  const buttonLeft = useRef(null);
  const buttonRight = useRef(null);

  const getScrollBy = (element: HTMLDivElement) => {
    return element.clientWidth * 0.92;
  };

  const getElementWidth = (element: HTMLElement) => {
    const style = element.style;
    const margin =
      (parseFloat(style.marginLeft) || 0) +
      (parseFloat(style.marginRight) || 0);
    return element.offsetWidth + margin;
  };

  const moveLeft = useCallback(() => {
    const maximumScrollLeft = (element: HTMLDivElement) => {
      const leftCutOf = carouselChildren.current.scrollLeft;
      let currentChild = -1;
      let currentPosX = 0;
      let maxScroll = 0;

      while (
        currentChild < element.children.length &&
        currentPosX < leftCutOf
      ) {
        currentChild += 1;
        maxScroll = currentPosX;
        currentPosX += getElementWidth(
          element.children[currentChild] as HTMLElement,
        );
      }

      return maxScroll - element.clientWidth;
    };

    carouselChildren.current.scroll({
      left: Math.max(
        carouselChildren.current.scrollLeft -
          getScrollBy(carouselChildren.current),
        maximumScrollLeft(carouselChildren.current),
      ),
      behavior: 'smooth',
    });
  }, [carouselChildren]);

  const moveRight = useCallback(() => {
    const maximumScrollRight = (element: HTMLDivElement) => {
      const rightCutOf =
        carouselChildren.current.scrollLeft + element.clientWidth;
      let currentChild = -1;
      let currentPosX = 0;
      let maxScroll = 0;

      while (
        currentChild < element.children.length &&
        currentPosX < rightCutOf
      ) {
        currentChild += 1;
        maxScroll = currentPosX;
        currentPosX += getElementWidth(
          element.children[currentChild] as HTMLElement,
        );
      }

      return maxScroll;
    };

    carouselChildren.current.scroll({
      left: Math.min(
        carouselChildren.current.scrollLeft +
          getScrollBy(carouselChildren.current),
        maximumScrollRight(carouselChildren.current),
      ),
      behavior: 'smooth',
    });
  }, [carouselChildren]);

  const resetScrollButtons = useCallback(() => {
    const element = carouselChildren.current;
    if (buttonLeft.current) {
      if (element.scrollLeft > 0) {
        buttonLeft.current.style.display = 'block';
      } else {
        buttonLeft.current.style.display = 'none';
      }
    }
    if (buttonRight.current) {
      if (
        element.scrollLeft + element.clientWidth < element.scrollWidth &&
        element.scrollWidth > element.clientWidth
      ) {
        buttonRight.current.style.display = 'block';
      } else {
        buttonRight.current.style.display = 'none';
      }
    }
  }, [carouselChildren, buttonLeft, buttonRight]);

  const registerObserver = useCallback(() => {
    if (carouselChildren && carouselChildren.current) {
      resetScrollButtons();
      carouselChildren.current.addEventListener('scroll', () => {
        resetScrollButtons();
      });
    }
  }, [carouselChildren, resetScrollButtons]);

  useEffect(() => {
    setTimeout(registerObserver, 200);
  }, [registerObserver]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.carouselChildren} ref={carouselChildren}>
        {children}
      </View>
      <View>
        <TouchableOpacity
          accessibilityLabel="Left Arrow button"
          ref={buttonLeft}
          style={styles.buttonLeft}
          onPress={moveLeft}>
          <LeftArrow width={10} height={10} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Right Arrow button"
          ref={buttonRight}
          style={styles.buttonRight}
          onPress={moveRight}>
          <RightArrow width={10} height={10} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    marginTop: 5,
    overflow: 'hidden',
    position: 'relative',
    maxWidth: 'inherit',
  },
  carouselChildren: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  buttonScroll: {
    position: 'absolute',
    width: 30,
    height: 40,
    top: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
  },
  buttonLeft: {
    position: 'absolute',
    width: 30,
    height: 40,
    top: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    left: 0,
  },
  buttonRight: {
    position: 'absolute',
    width: 30,
    height: 40,
    top: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    right: 0,
  },
  scrollButton: {
    width: 24,
  },
  messageTime: {
    color: colorTextGray,
  },
});
