import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { Auth } from "aws-amplify";

const Dialog = ({ message }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const authUser = async () => {
      const res = await Auth.currentAuthenticatedUser();
      setUser(res);
    };
    authUser();
  }, []);

  return (
    <View
      style={[
        styles.container,
        message.userID === user?.attributes?.sub
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
