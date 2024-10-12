import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/text";
import Svg, { Circle } from "react-native-svg";
import { Portal } from "@rn-primitives/portal";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.createAnimatedComponent(View);

const LoadingSpinner = () => {
  const { loading, text } = useLoadingContext();
  const [isVisible, setIsVisible] = useState(loading); // Control component visibility
  const progress = useSharedValue(0); // For circle animation
  const opacity = useSharedValue(0); // For fade in/out animation

  useEffect(() => {
    if (loading) {
      setIsVisible(true); // Ensure the component is visible

      // Start fade-in animation
      opacity.value = withTiming(1, { duration: 150 });

      // Start the circle animation
      progress.value = withRepeat(
        withTiming(4, {
          duration: 4000,
          easing: Easing.linear,
        }),
        -1, // Infinite repeats
        false, // Do not reverse
      );
    } else {
      // Start fade-out animation
      opacity.value = withTiming(0, { duration: 100 }, (isFinished) => {
        if (isFinished) {
          runOnJS(setIsVisible)(false); // Hide the component after animation
          progress.value = 0; // Reset the circle animation
        }
      });
    }
  }, [loading]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  // Animated props for the Circle strokeDashoffset
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  // Animated style for the overlay
  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <Portal name="spinner">
      <AnimatedView style={[styles.overlay, animatedOverlayStyle]}>
        <View style={styles.container}>
          <Svg height="50" width="50" viewBox="0 0 50 50">
            <AnimatedCircle
              cx="25"
              cy="25"
              r={radius}
              stroke="#1c9df9"
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
            />
          </Svg>
          {
            //<Image source={"Add Image Icon Here"} style={styles.nsIcon} resizeMode="contain" />
          }
          {text && (
            <Text
              className="font-bold text-primary"
              variant="h3"
              style={styles.text}
            >
              {text}
            </Text>
          )}
        </View>
      </AnimatedView>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire screen
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  nsIcon: {
    width: 30,
    height: 30,
    position: "absolute",
  },
  text: {
    bottom: -30,
    position: "absolute",
    fontSize: 16,
    fontFamily: "SeriousMD",
  },
});

export default LoadingSpinner;
