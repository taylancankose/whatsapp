import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../../graphql/subscriptions";
import ContactListItem from "../../components/ContactListItem";
import { deleteUserChatRoom } from "../../graphql/mutations";

const GroupInfoScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const chatroomID = route.params.id;

  const fetchChatRoom = async () => {
    setLoading(true);
    const response = await API.graphql(
      graphqlOperation(getChatRoom, { id: chatroomID })
    );
    setChatRoom(response.data?.getChatRoom);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRoom();
  }, [chatroomID]);

  useEffect(() => {
    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })
    ).subscribe({
      next: (value) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.value.data.onUpdateChatRoom,
        }));
      },
      onError: (err) => console.log(err, "hata"),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  const users = chatRoom.users.items.filter((i) => !i._deleted);

  const removeChatRoomUser = async (chatRoomUser) => {
    const response = await API.graphql(
      graphqlOperation(deleteUserChatRoom, {
        input: { _version: chatRoomUser._version, id: chatRoomUser.id },
      })
    );
    console.log(response);
  };

  const onContactPress = (chatRoomUser) => {
    Alert.alert(
      "Removing the User",
      `Are you sure you want to remove ${chatRoomUser.user.name} from this group`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeChatRoomUser(chatRoomUser),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>

      <View style={styles.innerContainer}>
        <Text style={styles.sectionTitle}>{users.length} Participants</Text>
        <Text
          onPress={() =>
            navigation.navigate("Add User", {
              chatRoom,
            })
          }
          style={styles.invite}
        >
          Invite User
        </Text>
      </View>
      <View style={styles.section}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={() => onContactPress(item)}
            />
          )}
          refreshing={loading}
          onRefresh={fetchChatRoom}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
  invite: {
    fontWeight: "bold",
    color: "royalblue",
  },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      updatedAt
      name
      users {
        items {
          id
          chatRoomId
          userId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
      createdAt
      _version
      _deleted
      _lastChangedAt
      chatRoomLastMessageId
    }
  }
`;

export default GroupInfoScreen;
