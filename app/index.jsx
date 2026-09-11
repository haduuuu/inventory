import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useUser } from '../hooks/useUser';

export default function Home() {
    const router = useRouter();
    const { user } = useUser();

    return (
        <View style={[styles.container, { backgroundColor: colors.light.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
                📦 Kirana Inventory
            </Text>
            <Text style={[styles.subtitle, { color: colors.light.text }]}>
                Real-time inventory management
            </Text>

            {!user?.isAuthenticated ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonOutline, { borderColor: colors.primary }]}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text style={[styles.buttonOutlineText, { color: colors.primary }]}>
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(dashboard)/products')}
                >
                    <Text style={styles.buttonText}>Go to Inventory</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonOutline: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonOutlineText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
