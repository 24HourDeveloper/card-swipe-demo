import React from "react";
import { View, ImageBackground, StyleSheet, Text } from "react-native";

class Card extends React.PureComponent {
  render() {
    return (
      <View style={styles.card}>
        <ImageBackground
          source={require("../assets/ocean.jpg")}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <View style={{ backgroundColor: "rgba(255,255,255,0.7)", flex: 1 }}>
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: "#000",
                fontWeight: "bold",
                marginBottom: 10,
                textDecorationLine: "underline"
              }}
            >
              {this.props.word}
            </Text>
            <View style={{ paddingHorizontal: 5 }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  lineHeight: 25
                }}
              >
                {this.props.challenge}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    height: 400,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 20,
    borderColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    elevation: 3,
    overflow: "hidden"
  }
});

export default Card;
