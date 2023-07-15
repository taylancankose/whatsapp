// src/screens/NotImplementedScreen.js

import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { Auth } from "aws-amplify";

const Settings = () => {
  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/capybara+copy.png",
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Pressable onPress={signOut} style={styles.btn}>
        <Text style={styles.text}>Sign Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  image: {
    width: "80%",
    aspectRatio: 2 / 1,
  },
  btn: {
    marginTop: 25,
    width: "80%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "royalblue",
    borderRadius: 8,

    elevation: 5,
  },
});

export default Settings;
