import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { colors } from "../../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { UserProvider } from "../../contexts/UserContext"
import UserOnly from "../../components/auth/UserOnly"

const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    return (
        <UserOnly>
            <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: theme.navbackground, paddingTop: 10, height: 90 }, tabBarActiveTintColor: theme.iconcolorfocused, tabBarInactiveTintColor: theme.iconcolor }}>
                <Tabs.Screen name="create" options={{ title: "Create", tabBarIcon: ({ focused }) => <Ionicons size={24} name={focused ? "create" : "create-outline"} color={focused ? theme.iconcolorfocused : theme.iconcolor} /> }} />
                <Tabs.Screen name="products" options={{ title: "Products", tabBarIcon: ({ focused }) => <Ionicons size={24} name={focused ? "cart" : "cart-outline"} color={focused ? theme.iconcolorfocused : theme.iconcolor} /> }} />
                <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ focused }) => <Ionicons size={24} name={focused ? "person" : "person-outline"} color={focused ? theme.iconcolorfocused : theme.iconcolor} /> }} />
                <Tabs.Screen
                    name="dash" // 👈 Changed from "dashboard" to "dash"
                    options={{
                        title: "Dashboard",
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                size={24}
                                name={focused ? "home" : "home-outline"} // "dashboard" isn't a valid Ionicons name, "home" or "grid" works perfectly!
                                color={focused ? theme.iconcolorfocused : theme.iconcolor}
                            />
                        )
                    }}
                />
            </Tabs>
        </UserOnly>

    )

}

export default DashboardLayout