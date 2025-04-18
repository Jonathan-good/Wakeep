import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: Platform.select({
                ios: {
                    // Use a transparent background on iOS to show the blur effect
                    position: 'absolute',
                },
                default: {},
            }),
        }}>

        <Tabs.Screen
            name="index"
            options={{
                title: "Alarm",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="alarm-outline" size={size} color={color} />
                ),
            }}
        />

        <Tabs.Screen
            name="log_page"
            options={{
                title: "Log",
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="barschart" size={size} color={color} />
                ),
            }}
        />

        <Tabs.Screen
            name="setting_page"
            options={{
                title: "Setting",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings-outline" size={size} color={color} />
                ),
            }}
        />
    
    </Tabs>
  );
}
