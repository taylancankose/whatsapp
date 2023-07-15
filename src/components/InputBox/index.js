import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const InputBox = () => {
  const [input, setInput] = useState("");
  const onSend = () => {
    console.warn("Sending a new message: ", input);
    setInput("");
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AntDesign name="plus" size={20} color="royalblue" />
        <TextInput
          onChangeText={(txt) => setInput(txt)}
          value={input}
          style={styles.input}
          placeholder="type your message"
          placeholderTextColor="#a6a6a6a6"
        />
        <MaterialIcons
          onPress={onSend}
          disabled={input === ""}
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
