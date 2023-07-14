import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useTimeFormatter from "../../hooks/useTimeFormatter";
dayjs.extend(relativeTime);

const ChatListItem = ({ item }) => {
  return (
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
