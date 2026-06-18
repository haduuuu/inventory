import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/Themedbutton'
import Spacer from '../../components/Spacer'
import { useUser } from '../../hooks/useUser'
import { colors } from '../../constants/colors'
import { useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Dashboard = () => {
    const { user, logout } = useUser()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: async () => {
                        try {
                            await logout()
                            router.replace('/(auth)/login')
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout: ' + error.message)
                        }
                    },
                    style: 'destructive',
                },
            ]
        )
    }

    const QuickAccessCard = ({ icon, title, description, onPress }) => (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.quickCard, { opacity: pressed ? 0.7 : 1 }]}>
            <ThemedCard style={styles.cardContent}>
                <Ionicons name={icon} size={32} color={theme.iconcolorfocused} style={styles.cardIcon} />
                <ThemedText style={styles.cardTitle} weight="bold">{title}</ThemedText>
                <ThemedText style={styles.cardDescription}>{description}</ThemedText>
            </ThemedCard>
        </Pressable>
    )

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Welcome Header */}
                <ThemedCard style={styles.headerCard}>
                    <ThemedText style={styles.welcomeTitle} title={true}>
                        Welcome! 👋
                    </ThemedText>
                    <Spacer height={8} />
                    <ThemedText style={styles.userEmail}>
                        {user?.email || 'User'}
                    </ThemedText>
                    <Spacer height={4} />
                    <ThemedText style={styles.subtitle}>
                        You're all set and ready to go
                    </ThemedText>
                </ThemedCard>

                <Spacer height={24} />

                {/* Quick Access Section */}
                <ThemedText style={styles.sectionTitle} weight="bold">
                    Quick Access
                </ThemedText>
                <Spacer height={12} />

                <QuickAccessCard
                    icon="create-outline"
                    title="Create Product"
                    description="Add a new product to your store"
                    onPress={() => router.push('/(dashboard)/create')}
                />

                <QuickAccessCard
                    icon="cart-outline"
                    title="My Products"
                    description="View and manage your products"
                    onPress={() => router.push('/(dashboard)/products')}
                />

                <QuickAccessCard
                    icon="person-outline"
                    title="Profile"
                    description="Manage your account settings"
                    onPress={() => router.push('/(dashboard)/profile')}
                />

                <Spacer height={24} />

                {/* Dashboard Stats */}
                <ThemedText style={styles.sectionTitle} weight="bold">
                    Account Info
                </ThemedText>
                <Spacer height={12} />

                <ThemedCard style={styles.infoCard}>
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="User ID" value={user?.$id || 'N/A'} />
                    <InfoRow label="Account Status" value="Active ✓" />
                </ThemedCard>

                <Spacer height={24} />

                {/* Logout Button */}
                <ThemedButton
                    onPress={handleLogout}
                    style={[styles.logoutButton, { backgroundColor: theme.warning || '#e74c3c' }]}
                >
                    <ThemedText style={styles.logoutText}>
                        Logout
                    </ThemedText>
                </ThemedButton>

                <Spacer height={20} />
            </ScrollView>
        </ThemedView>
    )
}

// Fixed lowercase reference lookup inside the standalone component
const InfoRow = ({ label, value }) => (
    <ThemedView style={styles.infoRow}>
        <ThemedText style={styles.infoLabel}>{label}</ThemedText>
        <ThemedText style={styles.infoValue} weight="semibold">{value}</ThemedText>
    </ThemedView>
)

export default Dashboard;

// FIXED: Changed "Styles" to lowercase "styles" to match your component calls
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    headerCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
    },
    welcomeTitle: {
        fontSize: 24,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    sectionTitle: {
        fontSize: 18,
        marginTop: 8,
    },
    quickCard: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIcon: {
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 12,
        opacity: 0.6,
        textAlign: 'center',
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    infoLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    infoValue: {
        fontSize: 14,
    },
    logoutButton: {
        marginTop: 8,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})