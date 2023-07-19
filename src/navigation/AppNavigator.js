import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MessageScreen from "../screens/MessageScreen";
import MainTabNavigator from "./MainTabNavigator";
import NewGroupScreen from "../screens/NewGroupScreen";
import ContactsScreen from "../screens/ContactsScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "whitesmoke" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="New Group" component={NewGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
