import {StatusBar} from 'expo-status-bar';
import {useCallback, useRef, useState} from 'react';
import {
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Cards from './card';
import {useSharedValue} from 'react-native-reanimated';

export default function App () {
  const [data, setData] = useState ([
    {id: 1, background: '#91cef0'},
    {id: 2, background: '#7fe8ba'},
    {id: 3, background: '#fbd78d'},
    {id: 4, background: '#d79064'},
    {id: 5, background: '#cc5f68'},
  ]);
  const MAX = 3;

  const [currentIndex, setCurrentIndex] = useState (0);
  const animatedValue = useSharedValue (0);
  const [isFirst, setIsFirst] = useState(0)
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {data.map ((item, index) => {
          if (index > currentIndex + MAX || index < currentIndex) {
            return null;
          }
          return (
            <Cards  
              item={item}
              index={index}
              datalength={data.length}
              key={index}
              MaxVisible={MAX}
              currentIndex={currentIndex}
              animatedValue={animatedValue}
              setCurrentIndex={setCurrentIndex}
              setData={setData}
              isFirst={isFirst}
              setIsFirst={setIsFirst}
            />
          );
        })}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginVertical: 150,
  },
});
