import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
dayjs.extend(relativeTime);

const ChatListItem = ({ item }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const userItem = item.users.items.find(
        (item) => item.user.id !== authUser.attributes.sub
      );
      setUser(userItem?.user);
    };
    getUser();
  }, []);

  const navigateMessage = () => {
    navigation.navigate("Message", {
      id: item.id,
      name: user.name,
    });
  };

  return (
    <Pressable onPress={navigateMessage}>
      <View style={styles.container}>
        <Image
          source={{
            uri: user?.image,
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.name}>
              {user?.name}
            </Text>
            {item?.LastMessage?.text && (
              <Text style={styles.hour}>
                {useTimeFormatter(item?.LastMessage?.createdAt)}
              </Text>
            )}
          </View>
          <Text numberOfLines={2} style={styles.subTitle}>
            {item?.LastMessage?.text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
  },
  hour: {
    color: "gray",
    fontWeight: "400",
    fontSize: 12,
  },
  subTitle: {
    color: "gray",
  },
});

export default ChatListItem;
