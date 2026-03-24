import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '../constants/colors'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
    return (
        <>
            <StatusBar style='auto' />
            <Stack screenOptions={{ headerStyle: { backgroundColor: theme.navbackground }, headerTintColor: theme.title }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ title: "Home" }} />
            </Stack>
        </>

    )
}

export default RootLayout

const styles = StyleSheet.create({})