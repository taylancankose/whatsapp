import { Text, ImageBackground, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import bg from "../../../assets/images/BG.png";
import Dialog from "../../components/Dialog";
import InputBox from "../../components/InputBox";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../../graphql/queries";
import { ActivityIndicator } from "react-native";

const MessageScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;
  const [chatRoom, setChatRoom] = useState();

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: id })).then((result) => {
      setChatRoom(result.data?.getChatRoom);
    });
  }, [id]);

  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID: id,
        sortDirection: "DESC",
      })
    ).then((res) => setMessages(res?.data?.listMessagesByChatRoom?.items));
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {name}
        </Text>
      ),
    });
  }, [name]);

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
