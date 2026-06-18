import { StyleSheet, View, ScrollView, Pressable, Text } from "react-native";
import { useUser } from "../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

// Custom Themed Components
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/Themedbutton";
import Spacer from "../../components/Spacer";

const Profile = () => {
    const isDarkMode = useColorScheme() === "dark";

    // 2. Pick dark pink for light mode, light pink for dark mode
    const dynamicPink = isDarkMode ? "#F48FB1" : "#C2185B";
    const { logout, user } = useUser();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    // Fallback theme colors in case global theme context isn't wrapped here
    const cardBackground = "#f9f9f9";
    const primaryColor = "#13159b";

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={[styles.avatarCircle, { backgroundColor: primaryColor }]}>
                        <ThemedText style={{ color: "#000000", fontSize: 32, fontWeight: "bold" }}>
                            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </ThemedText>
                    </View>
                    <Spacer height={15} />
                    <ThemedText style={[styles.userEmail, { color: dynamicPink }]}>{user?.email || "Guest User"}</ThemedText>
                    <ThemedText style={[styles.userId, { color: dynamicPink }]}>
                        ID: {user?.$id || "N/A"}
                    </ThemedText>
                </View>

                <Spacer height={20} />

                {/* Account Information Cards */}
                <ThemedText style={styles.sectionTitle}>Account Details</ThemedText>

                <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color={primaryColor} />
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Member Since</ThemedText>
                            <ThemedText style={styles.infoValue}>
                                {user?.$createdAt
                                    ? new Date(user.$createdAt).toLocaleDateString()
                                    : "N/A"}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <Spacer height={12} />

                <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
                    <View style={styles.infoRow}>
                        <Ionicons name="shield-checkmark" size={20} color={primaryColor} />
                        <View style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>Account Status</ThemedText>
                            <ThemedText style={styles.infoValue}>Active</ThemedText>
                        </View>
                    </View>
                </View>

                <Spacer height={25} />

                {/* Settings Menu Options */}
                <ThemedText style={styles.sectionTitle}>Settings</ThemedText>

                <Pressable style={[styles.settingsItem, { backgroundColor: cardBackground }]}>
                    <Ionicons name="notifications" size={20} color={primaryColor} />
                    <ThemedText style={styles.settingsText}>Notifications</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color="#000000" />
                </Pressable>

                <Spacer height={12} />

                <Pressable style={[styles.settingsItem, { backgroundColor: cardBackground }]}>
                    <Ionicons name="settings" size={20} color={primaryColor} />
                    <ThemedText style={styles.settingsText}>Account Settings</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color="#000000" />
                </Pressable>

                <Spacer height={12} />

                <Pressable style={[styles.settingsItem, { backgroundColor: cardBackground }]}>
                    <Ionicons name="help-circle" size={20} color={primaryColor} />
                    <ThemedText style={styles.settingsText}>Help & Support</ThemedText>
                    <Ionicons name="chevron-forward" size={20} color="#010101" />
                </Pressable>

                <Spacer height={35} />

                {/* Action Logout Button */}
                <ThemedButton onPress={handleLogout}>
                    <View style={styles.logoutButtonContent}>
                        <Ionicons name="log-out" size={20} color="#fff" />
                        <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
                    </View>
                </ThemedButton>

                <Spacer height={25} />

                {/* App Version Identifier */}
                <Text style={styles.appVersion}>App Version 1.0.0</Text>
                <Spacer height={40} />

            </ScrollView>
        </ThemedView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    profileHeader: {
        alignItems: "center",
        paddingVertical: 20,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    userEmail: {
        fontSize: 20,
        fontWeight: "bold",
    },
    userId: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoCard: {
        borderRadius: 10,
        padding: 15,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    infoContent: {
        flex: 1,
        color: "#333",
    },
    infoLabel: {
        fontSize: 12,
        color: "#333",
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    settingsItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        gap: 15,
    },
    settingsText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    logoutButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    appVersion: {
        textAlign: "center",
        fontSize: 12,
        color: "#333",
    },
});