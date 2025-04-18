import React, { useState, useEffect  } from "react";

import { Alert, View, StyleSheet, Button, TouchableOpacity, Text, FlatList} from "react-native";
import { Ionicons } from "@expo/vector-icons";

let cnt = 0;

interface SettingItem{
    id: number;
    name: string;
    on: boolean;
}

export default function Setting(){

    const [settings, setSettings] = useState<SettingItem[]>([]);

    const addSettings = (namee: string, onn: boolean) => {
        cnt = cnt + 1;
        let newSettingItem = {
            id: cnt,
            name: namee,
            on: onn,
        }

        setSettings((prev) => {
            return [...prev, newSettingItem];
        });
    }

    useEffect(() => {
        setSettings([]);
        addSettings(`Personal Information`, false);
        addSettings(`Notifications`, false);
        addSettings(`Account Privacy`, false);
        addSettings(`Community Settings`, false);
        addSettings(`Family Center`, false);
        addSettings(`About`, false);
        addSettings(`Languages`, false);
        addSettings(`Log Out`, false);

    }, []);

    return (

        <View style={styles.container}>
            <View style={[styles.card, styles.profileBox]}>
                <Ionicons style={styles.icon} name="finger-print-outline" size={50} color={"#000000"} />
                <Text style={styles.username}>
                    Username12645
                </Text>
            </View>
            <View style={[styles.card, styles.settingBox]}>
                <FlatList
                    data={settings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View>
                          <Text style={styles.settingItemStyle}>
                            {item.name}
                          </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.settingBox}
                />
            </View>
        </View>        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        marginBottom: "22%",
        marginTop: "10%",
    },
    header: {
        flexDirection: "row",
        marginBottom: 20,
        
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E2E2E",
        marginTop: 20,
        marginLeft: 30,
    },

    card: {
        margin: 16,
        backgroundColor: "white",
        marginLeft: "10%",
        marginRight: "10%",
        borderRadius: 15,

        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },

    profileBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    profile:{
        
    },

    username: {
        fontSize: 25,
    },

    settingBox: {
        paddingTop: "2%",
        paddingLeft: "5%",
        paddingBottom: "2%",
        flex: 5,
        justifyContent: "space-evenly",

    },

    settingItemStyle: {
        fontSize: 20,
    }
})