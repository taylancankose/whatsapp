import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { Auth, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native/dist/Storage";
import ImageView from "react-native-image-viewing";
import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native";

const Dialog = ({ message }) => {
  const [user, setUser] = useState();
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const res = await Auth.currentAuthenticatedUser();
      setUser(res);
    };
    authUser();
  }, []);

  useEffect(() => {
    const downloadImages = async () => {
      if (message.images?.length > 0) {
        const uri = await Storage.get(message.images[0]);
        setImageSources([{ uri }]);
      }
    };

    downloadImages();
  }, [message.images]);

  console.log(imageSources);

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
        <>
          <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
            <Image source={imageSources[0]} style={styles.image} />
          </TouchableOpacity>
          <ImageView
            images={imageSources}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </>
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
