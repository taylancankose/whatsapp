import { FlatList } from "react-native";
import ContactListItem from "../../components/ContactListItem/index";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { useEffect, useState } from "react";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) =>
      setUsers(result?.data?.listUsers?.items)
    );
  }, []);

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ContactListItem user={item} />}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default ContactsScreen;
