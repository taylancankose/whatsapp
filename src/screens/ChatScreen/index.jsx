import { View, Text, FlatList, SafeAreaView } from "react-native";
import React from "react";
import ChatListItem from "../../components/ChatListItem";
import chats from "../../../assets/data/chats.json";

const ChatScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {chats.length > 0 && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={chats}
          renderItem={({ item }) => <ChatListItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
