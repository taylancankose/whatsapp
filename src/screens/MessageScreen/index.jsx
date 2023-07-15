import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useLayoutEffect } from "react";
import bg from "../../../assets/images/BG.png";
import Dialog from "../../components/Dialog";
import messages from "../../../assets/data/messages.json";
import InputBox from "../../components/InputBox";
import { useNavigation, useRoute } from "@react-navigation/native";

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;

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
      <InputBox />
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
