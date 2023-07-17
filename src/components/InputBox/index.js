import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

const InputBox = ({ chatRoom }) => {
  const [text, setText] = useState("");

  const onSend = async () => {
    const userAuth = await Auth.currentAuthenticatedUser();

    const newInput = {
      chatroomID: chatRoom.id,
      text,
      userID: userAuth.attributes.sub,
    };

    const newMessageDate = await API.graphql(
      graphqlOperation(createMessage, { input: newInput })
    );
    setText("");

    // set the new message as the LastMessage of the ChatRoom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatRoom._version,
          chatRoomLastMessageId: newMessageDate.data?.createMessage?.id,
          id: chatRoom.id,
        },
      })
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AntDesign name="plus" size={20} color="royalblue" />
        <TextInput
          onChangeText={(txt) => setText(txt)}
          value={text}
          style={styles.input}
          placeholder="type your message"
          placeholderTextColor="#a6a6a6a6"
        />
        <MaterialIcons
          onPress={onSend}
          disabled={text === ""}
          style={styles.send}
          name="send"
          size={16}
          color="white"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default InputBox;
