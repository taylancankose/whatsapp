import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useTimeFormatter from "../../hooks/useTimeFormatter";
import { useNavigation } from "@react-navigation/native";
dayjs.extend(relativeTime);

const ChatListItem = ({ item }) => {
  const navigation = useNavigation();
  const navigateMessage = () => {
    navigation.navigate("Message", {
      id: item.id,
      name: item.user.name,
    });
  };
  return (
    <Pressable onPress={navigateMessage}>
      <View style={styles.container}>
        <Image
          source={{
            uri: item.user.image,
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.name}>
              {item.user.name}
            </Text>
            <Text style={styles.hour}>
              {useTimeFormatter(item.lastMessage.createdAt)}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.subTitle}>
            {item.lastMessage.text}
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
