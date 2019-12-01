import React from "react";
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Text
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Card from "./components/Card";
import { data } from "./data";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_RIGHT_OFF = SCREEN_WIDTH * 0.25;
class App extends React.Component {
  static defaultProps = {
    onRightSwipe: () => {},
    onLeftSwipe: () => {}
  };
  constructor() {
    super();

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_RIGHT_OFF) {
          this.swipeOff("right");
        } else if (gesture.dx < -SWIPE_RIGHT_OFF) {
          this.swipeOff("left");
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = {
      index: 0
    };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  swipeOff = direction => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.position, {
      toValue: { x: x * 1.5, y: 0 },
      duration: 250
    }).start(() => this.onSwipeComplete(direction));
  };

  onSwipeComplete = direction => {
    const { onRightSwipe, onLeftSwipe } = this.props;
    const item = data[this.state.index];

    direction === "right" ? onRightSwipe(item) : onLeftSwipe(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  };

  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  };

  renderCards = () => {
    return data
      .map((item, itemIndex) => {
        if (itemIndex < this.state.index) return null;
        if (itemIndex === this.state.index) {
          return (
            <Animated.View
              key={itemIndex}
              style={[
                styles.cardPosition,
                {
                  ...this.position.getLayout(),

                  transform: [
                    {
                      rotate: this.position.x.interpolate({
                        inputRange: [
                          -SCREEN_WIDTH * 2.5,
                          0,
                          SCREEN_WIDTH * 2.5
                        ],
                        outputRange: ["-120deg", "0deg", "120deg"]
                      })
                    }
                  ]
                },
                { zIndex: 1 }
              ]}
              {...this.panResponder.panHandlers}
            >
              <Card word={item.label} challenge={item.challenge} />
            </Animated.View>
          );
        }

        return (
          <Animated.View
            style={[
              { top: 10 * (itemIndex - this.state.index), zIndex: 0 },
              styles.cardPosition
            ]}
            key={itemIndex}
          >
            <Card word={item.label} challenge={item.challenge} />
          </Animated.View>
        );
      })
      .reverse();
  };
  render() {
    return (
      <View
        style={{ backgroundColor: "#D3D3D3", top: 30, flex: 1, paddingTop: 30 }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
          Love Challenge
        </Text>

        {this.state.index >= data.length ? (
          <View style={styles.container}>
          <View style={styles.cardPosition}>
          <Card word="Complete" challenge="You have completed the challenge to improve your love with your significant other. I hope these challenges helped you out."/>
          </View>
          </View>
        ) : (
          <View style={styles.container}>{this.renderCards()}</View>
        )}
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    top: 30
  },
  cardPosition: {
    position: "absolute",
    width: SCREEN_WIDTH,
    alignItems: "center"
  }
});
