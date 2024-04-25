import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React, { useCallback } from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  clamp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Choice from './choice';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Cards = ({
  index,
  item,
  datalength,
  MaxVisible,
  currentIndex,
  animatedValue,
  setCurrentIndex,
  setdata,
  isFirst,
  setIsFirst
}) => {
  const {width} = useWindowDimensions ();
  const data = item.background;
  const translateX = useSharedValue (0);
  const direction = useSharedValue (0);

  // const likeOpacity = interpolate({
  //   inputRange: [10, 100],
  //   outputRange: [0, 1],
  //   extrapolate: 'clamp',
  // });
  // const rejectOpacity = interpolate({
  //   inputRange: [-100, -10],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });
// 
  const pan = Gesture.Pan ()
    .onUpdate (e => {
      const isSwipeRight = e.translationX > 0;
      direction.value = isSwipeRight ? 1 : -1;
      if (currentIndex === index) {
        translateX.value = e.translationX;
        animatedValue.value = interpolate (
          Math.abs (e.translationX),
          [0, width],
          [index, index + 1]
        );
      }
    })
    .onEnd (e => {
      if (currentIndex === index) {
        if (Math.abs (e.translationX) > 150 || Math.abs (e.velocityX) > 1000) {
          translateX.value = withTiming (width * direction.value, {}, () => {
            runOnJS (setCurrentIndex) (currentIndex + 1);
          });
          animatedValue.value = withTiming (currentIndex + 1);
        } else {
          translateX.value = withTiming (0, {duration: 500});
          animatedValue.value = withTiming (currentIndex);
        }
      }
    });

  const animatedStyle = useAnimatedStyle (() => {
    const currentItem = index === currentIndex;
    const rotateZ = interpolate (
      Math.abs (translateX.value),
      [0, width],
      [0, 20
      ]
    );
    const translateY = interpolate (
      animatedValue.value,
      [index - 1, index],
      [45, 0]
    );
    const scale = interpolate (
      animatedValue.value,
      [index - 1, index],
      [0.9, 0.97]
    );
    const opacity = interpolate (
      animatedValue.value + MaxVisible,
      [index, index + 1],
      [0, 1]
    );
   
    return {
      transform: [
        {scale: currentItem ? 1 : scale},
        {translateY: currentItem ? 0 : translateY},
        {translateX: translateX.value},
        {rotateZ: currentItem ? `${direction.value * rotateZ}deg` : '0deg'},
      ],
      opacity: index < MaxVisible + currentIndex ? 1 : opacity,
      

    };
  });

  return (
    <GestureDetector gesture={pan}>

      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: data,
            zIndex: datalength - index,
          },
          animatedStyle,
        ]}
      >
        {/* <View style={{justifyContent:'space-between',flexDirection:'row'}}>
        <Animated.View style={{ opacity: animatedStyle.iconOpacity }}>
            <AntDesign name="checkcircle" size={55} color="green" />
          </Animated.View>
          <Animated.View style={{ opacity: animatedStyle.iconOpacity }}>
            <Entypo name="circle-with-cross" size={55} color="red" />
          </Animated.View>
        </View> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default Cards;

const styles = StyleSheet.create ({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    padding: 18,
  },
});
