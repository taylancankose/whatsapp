import { StyleSheet, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { withAuthenticator } from "aws-amplify-react-native";
import awsconfig from "./src/aws-exports";
import { useEffect } from "react";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
  useEffect(() => {
    const syncUser = async () => {
      // get Auth User
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      // query the database using Auth userID (sub)
      const userData = await API.graphql(
        graphqlOperation(getUser, { id: authUser?.attributes?.sub })
      );
      console.log(userData);

      if (userData?.data?.getUser) {
        console.log("User already exists in db");
        return;
      }
      // if there is no users in db, create one
      const newUser = {
        id: authUser?.attributes?.sub,
        name: authUser?.attributes?.email.split("@")[0],
        status: "Hey, I am using WhatsApp",
      };
      console.log(newUser);

      const newUserResponse = await API.graphql(
        graphqlOperation(createUser, { input: newUser })
      );
    };

    syncUser();
  }, []);

  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "whitesmoke",
  },
});

export default withAuthenticator(App);
