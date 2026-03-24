import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

export default function AuthLayout() {
    return (
        <>
            <StatusBar style='auto' />
            <Stack screenOptions={{ animation: 'none' }}>
                <Stack.Screen name="login" options={{ title: "Login" }} />
                <Stack.Screen name="register" options={{ title: "Register" }} />
            </Stack>
        </>
    )
}