import { StyleSheet, View, ScrollView, Pressable, useColorScheme, RefreshControl, Text } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'
import { useUser } from '../hooks/useUser'
import { ProductContext } from '../contexts/ProductContext'
import { colors } from '../constants/colors'

const LOW_STOCK_THRESHOLD = 5
const DAYS_UNTIL_EXPIRY_WARNING = 7

const Home = () => {
    const { user, loading } = useUser()
    const { products, fetchProducts } = useContext(ProductContext)
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    const [refreshing, setRefreshing] = useState(false)
    const [loadingProducts, setLoadingProducts] = useState(true)

    const loadProducts = useCallback(async () => {
        if (!user) {
            setLoadingProducts(false)
            return
        }
        await fetchProducts()
        setLoadingProducts(false)
    }, [user])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadProducts()
        setRefreshing(false)
    }

    const getQuantity = (p) => {
        const num = Number(p.stockLevel)
        return Number.isFinite(num) ? num : 0
    }

    const lowStockProducts = (products || [])
        .filter((p) => getQuantity(p) <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => getQuantity(a) - getQuantity(b))

    const isExpiringSoon = (p) => {
        if (!p.expiry_date) return false
        const diffDays = (new Date(p.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
        return diffDays >= 0 && diffDays <= DAYS_UNTIL_EXPIRY_WARNING
    }

    const expiringProducts = (products || [])
        .filter((p) => isExpiringSoon(p))
        .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))

    if (loading) {
        return <ThemedView style={styles.container} />
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.title} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting Section */}
                <View style={styles.greetingSection}>
                    <Pressable
                        style={({ pressed }) => [styles.profileButton, pressed && { opacity: 0.7 }]}
                        onPress={() => router.push('/profile')}
                        hitSlop={12}
                    >
                        <View style={[styles.avatarCircle, { backgroundColor: colors.primary + '20' }]}>
                            <Ionicons name="person" size={24} color={colors.primary} />
                        </View>
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.greeting}>
                            {user ? `  Hello${user.name ? `, ${user.name}` : ''}` : 'Welcome'}
                        </ThemedText>
                        <ThemedText style={styles.subGreeting}>  Manage your inventory</ThemedText>
                    </View>
                    <View style={[styles.avatarCircle, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name="cube" size={24} color={colors.primary} />
                    </View>
                </View>

                <Spacer height={40} />

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.actionCard,
                            { backgroundColor: colors.primary },
                            pressed && styles.actionCardPressed,
                        ]}
                        onPress={() => router.push('/products')}
                    >
                        <View style={styles.actionIconBox}>
                            <Ionicons name="cube-outline" size={26} color="#fff" />
                        </View>
                        <View style={styles.actionTextBox}>
                            <ThemedText style={styles.actionCardTitle}>All Products</ThemedText>
                            <Text style={styles.actionCardSubtitle}>{products?.length ?? 0} items</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#fff" style={{ opacity: 0.6 }} />
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionCard,
                            { backgroundColor: colors.primary },
                            pressed && styles.actionCardPressed,
                        ]}
                        onPress={() => router.push('/create')}
                    >
                        <View style={styles.actionIconBox}>
                            <Ionicons name="add-circle-outline" size={26} color="#fff" />
                        </View>
                        <View style={styles.actionTextBox}>
                            <ThemedText style={styles.actionCardTitle}>Add Product</ThemedText>
                            <Text style={styles.actionCardSubtitle}>Create new item</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#fff" style={{ opacity: 0.6 }} />
                    </Pressable>
                </View>

                <Spacer height={28} />

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: theme.unibackground }]}>
                        <View style={styles.statIconBox}>
                            <Ionicons name="layers-outline" size={20} color={colors.primary} />
                        </View>
                        <ThemedText style={styles.statValue}>{products?.length ?? 0}</ThemedText>
                        <ThemedText style={styles.statLabel}>Total Stock</ThemedText>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: theme.unibackground }]}>
                        <View style={styles.statIconBox}>
                            <Ionicons name="alert-circle-outline" size={20} color={colors.primary} />
                        </View>
                        <ThemedText style={[styles.statValue, { color: colors.primary }]}>
                            {lowStockProducts.length}
                        </ThemedText>
                        <ThemedText style={styles.statLabel}>Low Stock</ThemedText>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: theme.unibackground }]}>
                        <View style={styles.statIconBox}>
                            <Ionicons name="time-outline" size={20} color={colors.primary} />
                        </View>
                        <ThemedText style={[styles.statValue, { color: colors.primary }]}>
                            {expiringProducts.length}
                        </ThemedText>
                        <ThemedText style={styles.statLabel}>Expiring</ThemedText>
                    </View>
                </View>

                <Spacer height={28} />

                {/* Low Stock Section */}
                {lowStockProducts.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="alert-circle-outline" size={18} color={colors.primary} />
                                <ThemedText style={styles.sectionTitle}>Low Stock Alert</ThemedText>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{lowStockProducts.length}</Text>
                            </View>
                        </View>

                        <Spacer height={12} />

                        <View style={[styles.alertCard, { backgroundColor: theme.unibackground }]}>
                            {lowStockProducts.slice(0, 3).map((p, idx) => (
                                <Pressable
                                    key={p.$id}
                                    style={[styles.alertItem, idx < lowStockProducts.slice(0, 3).length - 1 && styles.alertItemBorder]}
                                    onPress={() => router.push('/products')}
                                >
                                    <View style={styles.alertLeftContent}>
                                        <ThemedText style={styles.alertProductName} numberOfLines={1}>
                                            {p.productName ?? 'Unnamed'}
                                        </ThemedText>
                                        <Text style={styles.alertSKU}>{p.productSKU}</Text>
                                    </View>
                                    <View style={[styles.alertStockPill, getQuantity(p) === 0 && styles.alertStockPillEmpty]}>
                                        <Text style={styles.alertStockText}>
                                            {getQuantity(p) === 0 ? 'Out' : `${getQuantity(p)}`}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>

                        {lowStockProducts.length > 3 && (
                            <Pressable style={styles.viewMoreLink} onPress={() => router.push('/products')}>
                                <Text style={styles.viewMoreText}>View all {lowStockProducts.length} alerts →</Text>
                            </Pressable>
                        )}

                        <Spacer height={24} />
                    </>
                )}

                {/* Expiring Section */}
                {expiringProducts.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <Ionicons name="time-outline" size={18} color={colors.primary} />
                                <ThemedText style={styles.sectionTitle}>Expiring Soon</ThemedText>
                            </View>
                        </View>

                        <Spacer height={12} />

                        <View style={[styles.alertCard, { backgroundColor: theme.unibackground }]}>
                            {expiringProducts.slice(0, 3).map((p, idx) => {
                                const isExpired = new Date(p.expiry_date) < new Date()
                                return (
                                    <Pressable
                                        key={p.$id}
                                        style={[styles.alertItem, idx < expiringProducts.slice(0, 3).length - 1 && styles.alertItemBorder]}
                                        onPress={() => router.push('/products')}
                                    >
                                        <View style={styles.alertLeftContent}>
                                            <ThemedText style={styles.alertProductName} numberOfLines={1}>
                                                {p.productName ?? 'Unnamed'}
                                            </ThemedText>
                                            <Text style={styles.alertSKU}>
                                                {isExpired ? 'Expired' : new Date(p.expiry_date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View style={[styles.alertStockPill, isExpired && styles.alertStockPillEmpty]}>
                                            <Text style={styles.alertStockText}>
                                                {isExpired ? '⚠' : '!'}
                                            </Text>
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </View>

                        <Spacer height={32} />
                    </>
                )}

                {/* Empty State */}
                {!loadingProducts && !user && (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={48} color={colors.primary} style={{ opacity: 0.3 }} />
                        <ThemedText style={styles.emptyStateText}>Log in to view your inventory</ThemedText>
                    </View>
                )}

                {!loadingProducts && user && products?.length === 0 && lowStockProducts.length === 0 && expiringProducts.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={48} color={colors.primary} />
                        <ThemedText style={styles.emptyStateText}>All inventory healthy!</ThemedText>
                        <Text style={styles.emptyStateSubtext}>Start by adding your first product</Text>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },
    greetingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    profileButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.primary + '10',
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    subGreeting: {
        fontSize: 14,
        opacity: 0.6,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickActionsSection: {
        gap: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        gap: 12,
    },
    actionCardPressed: {
        opacity: 0.85,
    },
    actionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTextBox: {
        flex: 1,
    },
    actionCardTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    actionCardSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        marginTop: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    statIconBox: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.6,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    alertCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    alertItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    alertItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    alertLeftContent: {
        flex: 1,
    },
    alertProductName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    alertSKU: {
        fontSize: 12,
        opacity: 0.5,
    },
    alertStockPill: {
        backgroundColor: colors.primary + '20',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
    },
    alertStockPillEmpty: {
        backgroundColor: colors.primary + '35',
    },
    alertStockText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    viewMoreLink: {
        marginTop: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
    viewMoreText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
        gap: 12,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyStateSubtext: {
        fontSize: 13,
        opacity: 0.5,
    },
})
