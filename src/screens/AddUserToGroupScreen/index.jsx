import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";

import { useNavigation, useRoute } from "@react-navigation/native";

const AddUserToGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { chatRoom } = route.params;
  console.log(chatRoom.id);

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(
        result.data?.listUsers?.items.filter(
          (item) =>
            !chatRoom.users.items.some(
              (i) => !i._deleted && item.id === i.userId
            )
        )
      );
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add to group"
          disabled={selectedUserIds.length < 1}
          onPress={onAddToGroupPress}
        />
      ),
    });
  }, [selectedUserIds]);

  const onAddToGroupPress = async () => {
    // Add the selected users to the ChatRoom
    await Promise.all(
      selectedUserIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: chatRoom.id, userId },
          })
        )
      )
    );

    setSelectedUserIds([]);
    // navigate to the back
    navigation.goBack();
  };

  const onContactPress = (id) => {
    setSelectedUserIds((userIds) => {
      if (userIds.includes(id)) {
        // remove id from selected
        return [...userIds].filter((uid) => uid !== id);
      } else {
        // add id to selected
        return [...userIds, id];
      }
    });
  };

  return (
    <View style={styles.container}>
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

export default AddUserToGroupScreen;
