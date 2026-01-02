import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

const DISK_SIZE = 100;

type RotatingDiskProps = {
  imageUri?: string;
  isRotating?: boolean;
};

const RotatingDisk: React.FC<RotatingDiskProps> = ({
  imageUri = 'https://thegamerscut.com/wp-content/uploads/2025/06/wuthering-waves-cartethyia-550x309-1.jpg',
  isRotating = true,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const isStopped = useRef(false);

  useEffect(() => {
    isStopped.current = !isRotating;

    if (isRotating) {
      rotateAnim.setValue(0);
      startRotation();
    }

    return () => {
      isStopped.current = true;
      rotateAnim.stopAnimation();
    };
  }, [isRotating]);

  const startRotation = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !isStopped.current) {
        rotateAnim.setValue(0); // 🔥 critical reset
        startRotation();        // 🔁 manual loop
      }
    });
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.disk,
          { transform: [{ rotate }] },
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.diskImage}
        />
        <View style={styles.centerHole} />
      </Animated.View>
    </View>
  );
};

export default RotatingDisk;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  disk: {
    width: DISK_SIZE,
    height: DISK_SIZE,
    borderRadius: DISK_SIZE / 2,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  diskImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: DISK_SIZE / 2,
  },

  centerHole: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#555',
  },
});
