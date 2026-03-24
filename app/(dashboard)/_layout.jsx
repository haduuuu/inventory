import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { colors } from "../../constants/colors"

const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: theme.tabBarBackground, paddingTop: 10, height: 90 }, tabBarActiveTintColor: theme.iconColorFocused, tabBarInactiveTintColor: theme.iconColor }}>
            <Tabs.Screen name="create" options={{ title: "Create" }} />
            <Tabs.Screen name="products" options={{ title: "Products" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    )
}

export default DashboardLayout