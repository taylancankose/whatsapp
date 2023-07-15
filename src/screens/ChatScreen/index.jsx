import { FlatList } from "react-native";
import React from "react";
import ChatListItem from "../../components/ChatListItem";
import chats from "../../../assets/data/chats.json";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      {chats.length > 0 && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={chats}
          style={{
            backgroundColor: "white",
            marginTop: -25,
          }}
          renderItem={({ item }) => <ChatListItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
