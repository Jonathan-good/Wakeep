import * as React from "react"

import {Text, View, StyleSheet} from "react-native";

export default function Log(){
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                Welcome to Log!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E2E2E",
        marginTop: 20,
        marginLeft: 30,
    }
})
