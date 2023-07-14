import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ChatListItem from "./src/components/ChatListItem";
import ChatScreen from "./src/screens/ChatScreen";
import MessageScreen from "./src/screens/MessageScreen";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <ChatScreen /> */}
      <MessageScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: 50,
  },
});
