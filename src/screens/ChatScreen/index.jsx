import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ChatListItem from "../../components/ChatListItem";
import chats from "../../../assets/data/chats.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";

const ChatScreen = () => {
  const [chatRooms, setChatRooms] = useState();
  useEffect(() => {
    const getChatRooms = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser?.attributes?.sub })
      );

      const rooms = response.data?.getUser?.ChatRooms?.items || [];
      const sortedRooms = rooms.sort(
        (room1, room2) =>
          new Date(room2.chatRoom.updatedAt) -
          new Date(room1.chatRoom.updatedAt)
      );

      setChatRooms(sortedRooms);
    };
    getChatRooms();
  }, []);

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
          keyExtractor={(item) => item.chatRoom.id}
          data={chatRooms}
          style={{
            backgroundColor: "white",
            marginTop: -25,
          }}
          renderItem={({ item }) => <ChatListItem item={item.chatRoom} />}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
