import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { Auth, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native/dist/Storage";
import ImageView from "react-native-image-viewing";
import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";

const Dialog = ({ message }) => {
  const [user, setUser] = useState();
  const [imageSources, setImageSources] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const { width } = useWindowDimensions();
  useEffect(() => {
    const authUser = async () => {
      const res = await Auth.currentAuthenticatedUser();
      setUser(res);
    };
    authUser();
  }, []);

  useEffect(() => {
    const downloadImages = async () => {
      if (message?.images?.length > 0) {
        const uris = await Promise.all(
          message?.images?.map((img) => Storage.get(img))
        );
        console.log(uris);

        setImageSources(uris.map((uri) => ({ uri })));
      }
    };

    downloadImages();
  }, [message.images]);

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
      {imageSources.length > 0 && (
        <View style={{ width: width * 0.8 - 30 }}>
          <View style={styles.images}>
            {imageSources.map((imageSource) => (
              <Pressable
                style={[
                  styles.imageContainer,
                  imageSources.length === 1 && { flex: 1 },
                ]}
                onPress={() => setImageViewerVisible(true)}
              >
                <Image source={imageSource} style={styles.image} />
              </Pressable>
            ))}
          </View>
          <ImageView
            images={imageSources}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </View>
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
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "45%",
    borderColor: "white",
    margin: 2,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
  },
});
export default Dialog;
