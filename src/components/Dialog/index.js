import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import useTimeFormatter from "../../hooks/useTimeFormatter";

const Dialog = ({ message }) => {
  const isMyMessage = () => {
    return (message.user.id = "u1");
  };
  console.log(message.user.id);

  return (
    <View
      style={[
        styles.container,
        message.user.id === "u1"
          ? {
              backgroundColor: "#DCF8C5",
              alignSelf: "flex-end",
            }
          : {
              backgroundColor: "white",
              alignSelf: "flex-start",
            },
      ]}
    >
      <Text>{message.text}</Text>
      <Text style={styles.time}>{useTimeFormatter(message.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    maxWidth: "80%",
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
});
export default Dialog;
