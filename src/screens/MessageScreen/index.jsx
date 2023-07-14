import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import bg from "../../../assets/images/BG.png";
import Dialog from "../../components/Dialog";
import messages from "../../../assets/data/messages.json";
import InputBox from "../../components/InputBox";

const MessageScreen = () => {
  console.log(messages, "s");

  return (
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList
        keyExtractor={(item) => item.id}
        inverted
        data={messages}
        style={styles.list}
        renderItem={({ item }) => <Dialog message={item} />}
        showsVerticalScrollIndicator={false}
      />
      <InputBox />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default MessageScreen;
