import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { Auth } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native/dist/Storage";

const Dialog = ({ message }) => {
  const [user, setUser] = useState();
  console.log(message.images);

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
      {message.images?.length > 0 && (
        <S3Image imgKey={message.images[0]} style={styles.image} />
      )}
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
  image: {
    width: 200,
    height: 100,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  },
});
export default Dialog;
