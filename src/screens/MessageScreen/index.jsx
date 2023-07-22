import { Text, ImageBackground, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import bg from "../../../assets/images/BG.png";
import Dialog from "../../components/Dialog";
import InputBox from "../../components/InputBox";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../../graphql/queries";
import { ActivityIndicator } from "react-native";
import { onCreateMessage, onUpdateChatRoom } from "../../graphql/subscriptions";
import { Feather } from "@expo/vector-icons";

const MessageScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;
  const [chatRoom, setChatRoom] = useState();
  console.log(name);

  useEffect(() => {
    // fetch chatroom
    API.graphql(graphqlOperation(getChatRoom, { id })).then((result) => {
      setChatRoom(result.data?.getChatRoom);
    });

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: id } } })
    ).subscribe({
      next: (value) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.value.data.onUpdateChatRoom,
        }));
      },
      onError: (err) => console.log(err, "hata"),
    });
    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    // fetch messages
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID: id,
        sortDirection: "DESC",
      })
    ).then((res) => setMessages(res?.data?.listMessagesByChatRoom?.items));

    // subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, { filter: { chatroomID: { eq: id } } })
    ).subscribe({
      next: (value) => {
        setMessages((m) => [value.value.data.onCreateMessage, ...m]);
      },
      onError: (err) => console.log(err, "hata"),
    });
    return () => subscription.unsubscribe();
  }, [id]);

  console.log(messages, "sadh");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {name ? name : "Chat"}
        </Text>
      ),
      headerRight: () => (
        <Feather
          name="more-vertical"
          size={24}
          color={"gray"}
          onPress={() => navigation.navigate("Group Info", { id: id })}
        />
      ),
    });
  }, [name, id]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.contentContainer}
        data={messages}
        style={styles.list}
        renderItem={({ item }) => <Dialog message={item} />}
        showsVerticalScrollIndicator={false}
      />
      <InputBox chatRoom={chatRoom} />
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
  contentContainer: {
    paddingVertical: 5,
    marginTop: -10,
  },
});

export default MessageScreen;
