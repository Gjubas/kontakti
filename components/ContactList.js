import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false);
  const [error, setError] = useState(null);

  const getContacts = async () => {
    setIsFetchingContacts(true);
    setError(null);

    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
      } else {
        setError("Permission to access contacts was denied.");
      }
    } catch (e) {
      console.error("Error while fetching contacts:", e);
      setError("Error while fetching contacts.");
    }

    setIsFetchingContacts(false);
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contact}>
            <Text>{item.name}</Text>
            {item.phoneNumbers.length > 0 && (
              <Text>{item.phoneNumbers[0].number}</Text>
            )}
          </View>
        )}
      />
      <Button
        style={styles.button}
        title="Get Contacts"
        onPress={getContacts}
        disabled={isFetchingContacts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    padding: 16,
  },
  contact: {
    marginBottom: 16,
  },
  button: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 16,
  },
});
