import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import { listChatRooms } from "../../graphql/queries";
import { getCommonChatRoomWithUser } from "../../services/chatRoomService";
import { Auth } from "aws-amplify";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ContactListItem = ({ user }) => {
  const navigation = useNavigation();

  const onPress = async () => {
    console.warn("Pressed");
    // Check if we already have a ChatRoom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      navigation.navigate("Chat", { id: existingChatRoom.id });
    }
    // Create a new ChatRoom => createChatRoom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    if (!newChatRoomData?.data?.createChatRoom) {
      console.log("Error creating the chatroom");
    }
    const newChatRoom = newChatRoomData?.data?.createChatRoom;
    // Add the clicked user to the ChatRoom => createUserChatRoom

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: user.id },
      })
    );
    // Add the auth user to the ChatRoom => createUserChatRoom
    const authUser = await Auth.currentAuthenticatedUser();

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );
    // Navigate to the newly created ChatRoom
    navigation.navigate("Message", {
      id: newChatRoom.id,
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>

        <Text numberOfLines={2} style={styles.subTitle}>
          {user.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
    paddingRight: 10,
  },
  content: {
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ContactListItem;
