import { StyleSheet, View, ScrollView, Pressable, Alert, useColorScheme, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { useUser } from '../../hooks/useUser'
import { useLanguage } from '../../contexts/LanguageContext'
import { t } from '../../constants/localization'
import { colors } from '../../constants/colors'

const Profile = () => {
    const { user, logout } = useUser()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
    const { language, changeLanguage } = useLanguage()

    const handleLogout = () => {
        Alert.alert(
            t(language, 'profile_logout'),
            t(language, 'profile_logout_confirm'),
            [
                { text: t(language, 'cancel'), style: 'cancel' },
                {
                    text: t(language, 'profile_logout'),
                    style: 'destructive',
                    onPress: async () => {
                        await logout()
                        router.replace('/(auth)/login')
                    },
                },
            ]
        )
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.primary} />
                    </Pressable>
                    <ThemedText title={true} style={styles.title}>
                        {t(language, 'profile_title')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                <Spacer height={24} />

                {/* User Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarCircle, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name="person" size={48} color={colors.primary} />
                    </View>
                    <ThemedText style={styles.userName} title={true}>
                        {user?.name || 'User'}
                    </ThemedText>
                    <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
                </View>

                <Spacer height={28} />

                {/* Account Information Section */}
                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>
                        {t(language, 'profile_account_info')}
                    </ThemedText>
                    <Spacer height={12} />

                    <View style={[styles.infoCard, { backgroundColor: theme.unibackground }]}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Ionicons name="mail-outline" size={18} color={colors.primary} />
                                <ThemedText style={styles.infoLabel}>
                                    {t(language, 'profile_email')}
                                </ThemedText>
                            </View>
                            <Text style={styles.infoValue} numberOfLines={1}>
                                {user?.email || 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Ionicons name="person-outline" size={18} color={colors.primary} />
                                <ThemedText style={styles.infoLabel}>
                                    {t(language, 'profile_name')}
                                </ThemedText>
                            </View>
                            <Text style={styles.infoValue} numberOfLines={1}>
                                {user?.name || 'Not set'}
                            </Text>
                        </View>
                    </View>
                </View>

                <Spacer height={28} />

                {/* Language Selection Section */}
                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>
                        {t(language, 'profile_language')}
                    </ThemedText>
                    <Spacer height={12} />

                    <View style={styles.languageButtonsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.languageButton,
                                { backgroundColor: theme.unibackground },
                                language === 'en' && styles.languageButtonActive,
                                pressed && styles.languageButtonPressed,
                            ]}
                            onPress={() => changeLanguage('en')}
                        >
                            {language === 'en' && (
                                <View style={styles.languageCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </View>
                            )}
                            <Ionicons
                                name="globe-outline"
                                size={24}
                                color={language === 'en' ? '#fff' : colors.primary}
                            />
                            <ThemedText style={[styles.languageName, language === 'en' && styles.languageNameActive]}>
                                English
                            </ThemedText>
                            <Text style={[styles.languageNative, language === 'en' && styles.languageNativeActive]}>
                                अंग्रेजी
                            </Text>
                        </Pressable>

                        <Spacer height={12} />

                        <Pressable
                            style={({ pressed }) => [
                                styles.languageButton,
                                { backgroundColor: theme.unibackground },
                                language === 'ne' && styles.languageButtonActive,
                                pressed && styles.languageButtonPressed,
                            ]}
                            onPress={() => changeLanguage('ne')}
                        >
                            {language === 'ne' && (
                                <View style={styles.languageCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </View>
                            )}
                            <Ionicons
                                name="flag-outline"
                                size={24}
                                color={language === 'ne' ? '#fff' : colors.primary}
                            />
                            <ThemedText style={[styles.languageName, language === 'ne' && styles.languageNameActive]}>
                                नेपाली
                            </ThemedText>
                            <Text style={[styles.languageNative, language === 'ne' && styles.languageNativeActive]}>
                                Nepali
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Spacer height={28} />

                {/* Logout Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed,
                    ]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={18} color="#fff" />
                    <ThemedText style={styles.logoutButtonText}>
                        {t(language, 'profile_logout')}
                    </ThemedText>
                </Pressable>

                <Spacer height={30} />
            </ScrollView>
        </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        flex: 1,
        textAlign: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        gap: 8,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 13,
        opacity: 0.6,
    },
    sectionContainer: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.6,
    },
    infoCard: {
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 13,
        opacity: 0.6,
        maxWidth: '50%',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },
    languageButtonsContainer: {
        gap: 10,
    },
    languageButton: {
        borderRadius: 14,
        padding: 14,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
    },
    languageButtonActive: {
        backgroundColor: colors.primary,
    },
    languageButtonPressed: {
        opacity: 0.75,
    },
    languageCheckmark: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageName: {
        fontSize: 16,
        fontWeight: '700',
    },
    languageNameActive: {
        color: '#fff',
    },
    languageNative: {
        fontSize: 13,
        opacity: 0.6,
    },
    languageNativeActive: {
        color: 'rgba(255,255,255,0.8)',
        opacity: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
    },
    logoutButtonPressed: {
        opacity: 0.8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
})
