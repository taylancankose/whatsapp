import { StyleSheet, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import awsconfig from "./src/aws-exports";

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {
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
