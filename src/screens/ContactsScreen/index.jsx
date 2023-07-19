import { FlatList, Pressable, Text } from "react-native";
import ContactListItem from "../../components/ContactListItem/index";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { useEffect, useState } from "react";
import { getCommonChatRoomWithUser } from "../../services/chatRoomService";
import { useNavigation } from "@react-navigation/native";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import { MaterialIcons } from "@expo/vector-icons";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState();

  const navigation = useNavigation();
  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) =>
      setUsers(result?.data?.listUsers?.items)
    );
  }, []);

  const createChatRoomWithUser = async (user) => {
    console.warn("Pressed");
    const authUser = await Auth.currentAuthenticatedUser();

    // Check if we already have a ChatRoom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      const userItem = await existingChatRoom?.chatRoom?.users?.items?.find(
        (c) => c.user.id !== authUser?.attributes?.sub
      );
      setChatUser(userItem?.user?.name);
      navigation.navigate("Message", {
        id: existingChatRoom?.chatRoom?.id,
        name: chatUser,
      });
      return;
    }

    // Create a new ChatRoom => createChatRoom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    if (!newChatRoomData?.data?.createChatRoom) {
      console.log("Error creating the chatroom");
    }
    const newChatRoom = newChatRoomData.data.createChatRoom;
    // Add the clicked user to the ChatRoom => createUserChatRoom

    const addedUser = await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: user.id },
      })
    );
    // Add the auth user to the ChatRoom => createUserChatRoom

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    // Navigate to the newly created ChatRoom
    navigation.navigate("Message", {
      id: newChatRoom.id,
      name: addedUser?.data?.createUserChatRoom?.user?.name,
    });
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <ContactListItem
          user={item}
          onPress={() => createChatRoomWithUser(item)}
        />
      )}
      style={{ backgroundColor: "white" }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => navigation.navigate("New Group")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

export default ContactsScreen;
