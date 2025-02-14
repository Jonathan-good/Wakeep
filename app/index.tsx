import * as React from "react";

// Importing components from react-native library.
import { Alert, View, StyleSheet, Button } from "react-native";

export default function App() {

  const onPressButton = () => {
    Alert.alert('Welcome To GeeksForGeeks..')
  }

  const styles = StyleSheet.create({
    container: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',

    }
  })

  return (

    // Using react-natives built in components.
    <View style={styles.container}>

      <Button onPress={onPressButton} 
              title="Press Me" color="green" />

    </View>
  );
}
