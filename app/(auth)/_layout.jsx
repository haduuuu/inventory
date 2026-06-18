import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import { UserContext, UserProvider } from '../../contexts/UserContext'
import { useUser } from '../../hooks/useUser'
import { use } from 'react'
import GuestOnly from '../../components/auth/GuestOnly'
import UserOnly from '../../components/auth/UserOnly'

export default function AuthLayout() {
    const { user } = useUser()
    return (
        <GuestOnly>
            <StatusBar style='auto' />
            <Stack screenOptions={{ animation: 'none' }}>
                <Stack.Screen name="login" options={{ title: "Login" }} />
                <Stack.Screen name="register" options={{ title: "Register" }} />
            </Stack>
        </GuestOnly>
    )
}