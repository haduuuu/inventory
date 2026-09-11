import { Stack } from 'expo-router';
import { colors } from '../../constants/colors';

export default function DashboardLayout() {
    const theme = colors.light;

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.navbackground },
                headerTintColor: theme.title,
            }}
        >
            <Stack.Screen name="products" options={{ title: "Products", headerShown: false }} />
            <Stack.Screen name="create" options={{ title: "Add Product", headerShown: true }} />
            <Stack.Screen name="edit" options={{ title: "Edit Product", headerShown: true }} />
            <Stack.Screen name="scan" options={{ title: "Scan", headerShown: true }} />
            <Stack.Screen name="profile" options={{ title: "Profile", headerShown: true }} />
        </Stack>
    );
}
