import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { useNavigation } from "@react-navigation/native";
import ContactListItem from "../../components/ContactListItem";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUserIds.length < 1}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedUserIds]);

  const onCreateGroupPress = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    // Create a new ChatRoom => createChatRoom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    if (!newChatRoomData?.data?.createChatRoom) {
      console.log("Error creating the chatroom");
    }
    const newChatRoom = newChatRoomData.data.createChatRoom;
    // Add the selected users to the ChatRoom => createUserChatRoom
    await Promise.all(
      selectedUserIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId },
          })
        )
      )
    );
    // Add the auth user to the ChatRoom => createUserChatRoom

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    setSelectedUserIds([]);

    // Navigate to the newly created ChatRoom
    navigation.navigate("Message", {
      id: newChatRoom.id,
      name: name,
    });

    setName("");
  };

  const onContactPress = (id) => {
    setSelectedUserIds((prevIDs) => {
      if (prevIDs.includes(id)) {
        // remove id from selected
        return [...prevIDs].filter((i) => i !== id);
      } else {
        // add id
        return [...prevIDs, id];
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            selectable
            onPress={() => onContactPress(item.id)}
            isSelected={selectedUserIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default NewGroupScreen;
