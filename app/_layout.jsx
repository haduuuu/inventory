import { StyleSheet, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { colors } from '../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContext'
import { ProductProvider } from '../contexts/ProductContext'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    return (
        <UserProvider>
            <ProductProvider>
                <StatusBar style='auto' />
                <Stack screenOptions={{ headerStyle: { backgroundColor: theme.navbackground }, headerTintColor: theme.title }}>
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ title: "Home" }} />
                </Stack>
            </ProductProvider>
        </UserProvider>
    )
}

export default RootLayout