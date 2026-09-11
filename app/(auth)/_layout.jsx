import { Stack } from 'expo-router';
import { useUser } from '../../hooks/useUser';

export default function AuthLayout() {
    const { user } = useUser()
    return (
        <Stack>
            <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
            <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
        </Stack>
    );
}
