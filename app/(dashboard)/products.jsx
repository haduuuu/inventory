import { StyleSheet, View, ScrollView, Pressable, Alert, useColorScheme, ActivityIndicator, Text, FlatList } from "react-native";
import { useState, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProducts } from "../../hooks/useProducts";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import { colors } from "../../constants/colors";

const CATEGORY_OPTIONS = [
    'electronics', 'furniture', 'apparel', 'health', 'beauty',
    'groceries', 'stationery', 'toys', 'sports', 'kitchenware',
    'tools', 'automotive', 'books', 'footwear', 'accessories',
    'home_decor', 'pet_supplies', 'office_supplies', 'other',
];

const CATEGORY_ICONS = {
    electronics: 'flash-outline',
    furniture: 'home-outline',
    apparel: 'shirt-outline',
    health: 'medical-outline',
    beauty: 'sparkles-outline',
    groceries: 'cart-outline',
    stationery: 'document-outline',
    toys: 'game-controller-outline',
    sports: 'football-outline',
    kitchenware: 'cafe-outline',
    tools: 'hammer-outline',
    automotive: 'car-outline',
    books: 'book-outline',
    footwear: 'footsteps-outline',
    accessories: 'bag-outline',
    home_decor: 'flower-outline',
    pet_supplies: 'paw-outline',
    office_supplies: 'briefcase-outline',
    other: 'ellipsis-horizontal-outline',
};

const Products = () => {
    const { products, deleteProduct } = useProducts();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme] ?? colors.light;
    const [deletingId, setDeletingId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Group products by category
    const groupedProducts = useMemo(() => {
        if (!products || products.length === 0) return {};

        const grouped = {};
        products.forEach(product => {
            const cat = product.category || 'other';
            if (!grouped[cat]) {
                grouped[cat] = [];
            }
            grouped[cat].push(product);
        });
        return grouped;
    }, [products]);

    // Get products for selected category
    const displayedProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return products || [];
        }
        return groupedProducts[selectedCategory] || [];
    }, [selectedCategory, products, groupedProducts]);

    // Get available categories that have products
    const availableCategories = useMemo(() => {
        return ['all', ...Object.keys(groupedProducts)].filter(cat => {
            if (cat === 'all') return true;
            return groupedProducts[cat] && groupedProducts[cat].length > 0;
        });
    }, [groupedProducts]);

    const handleEdit = (productId) => {
        router.push(`/(dashboard)/edit?productId=${productId}`);
    };

    const performDelete = async (productId) => {
        setDeletingId(productId);
        try {
            await deleteProduct(productId);
        } catch (error) {
            Alert.alert("Couldn't delete product", error.message || "Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDelete = (productId, productName) => {
        Alert.alert(
            "Delete product",
            `Are you sure you want to delete "${productName || "this product"}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => performDelete(productId) },
            ]
        );
    };

    const formatCategoryName = (cat) => {
        if (cat === 'all') return 'All';
        return cat.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
    };

    const getCategoryIcon = (cat) => {
        return CATEGORY_ICONS[cat] || 'cube-outline';
    };

    // Show categories or products based on selection
    const showingCategories = selectedCategory === null;

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTop}>
                        <View style={{ flex: 1 }}>
                            <ThemedText title={true} style={styles.title}>
                                Products
                            </ThemedText>
                            <Text style={styles.subtitle}>
                                {displayedProducts.length} items
                            </Text>
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
                            onPress={() => router.push('/(dashboard)/scan?mode=lookup')}
                        >
                            <Ionicons name="barcode-outline" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    <Spacer height={20} />

                    {/* Category Grid */}
                    <View>
                        <ThemedText style={styles.sectionLabel}>Browse by Category</ThemedText>
                        <Spacer height={12} />

                        <View style={styles.categoryGrid}>
                            {availableCategories.map((category) => {
                                const isSelected = selectedCategory === category;
                                const count = category === 'all'
                                    ? products?.length || 0
                                    : groupedProducts[category]?.length || 0;

                                return (
                                    <Pressable
                                        key={category}
                                        style={({ pressed }) => [
                                            styles.categoryBox,
                                            { backgroundColor: theme.unibackground },
                                            isSelected && styles.categoryBoxSelected,
                                            pressed && styles.categoryBoxPressed,
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <View style={[styles.categoryIconBox, isSelected && styles.categoryIconBoxSelected]}>
                                            <Ionicons
                                                name={getCategoryIcon(category)}
                                                size={28}
                                                color={isSelected ? '#fff' : colors.primary}
                                            />
                                        </View>
                                        <ThemedText style={[styles.categoryBoxName, isSelected && styles.categoryBoxNameSelected]}>
                                            {formatCategoryName(category)}
                                        </ThemedText>
                                        <View style={[styles.categoryBoxBadge, isSelected && styles.categoryBoxBadgeSelected]}>
                                            <Text style={[styles.categoryBoxBadgeText, isSelected && styles.categoryBoxBadgeTextSelected]}>
                                                {count}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <Spacer height={24} />

                {/* Products List */}
                {selectedCategory !== 'all' && displayedProducts.length > 0 && (
                    <>
                        <View style={styles.productsHeader}>
                            <Pressable onPress={() => setSelectedCategory('all')} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={20} color={colors.primary} />
                            </Pressable>
                            <ThemedText style={styles.productsTitle}>
                                {formatCategoryName(selectedCategory)}
                            </ThemedText>
                            <View style={{ width: 20 }} />
                        </View>
                        <Spacer height={14} />
                    </>
                )}

                {displayedProducts && displayedProducts.length > 0 ? (
                    <View style={styles.productsList}>
                        {displayedProducts.map((product) => {
                            const stockLevel = Number(product.stockLevel) || 0;
                            const isLowStock = stockLevel <= 5;

                            return (
                                <Pressable
                                    key={product.$id}
                                    style={({ pressed }) => [
                                        styles.productCard,
                                        { backgroundColor: theme.unibackground },
                                        pressed && styles.productCardPressed,
                                    ]}
                                    onPress={() => handleEdit(product.$id)}
                                >
                                    {/* Stock Badge */}
                                    <View style={[styles.stockBadge, isLowStock && styles.stockBadgeLow]}>
                                        <Text style={styles.stockBadgeText}>
                                            {stockLevel}
                                        </Text>
                                    </View>

                                    {/* Main Content */}
                                    <View style={styles.productContent}>
                                        <View style={styles.productHeader}>
                                            <View style={styles.productInfo}>
                                                <ThemedText style={styles.productName} numberOfLines={1}>
                                                    {product.productName || "Unnamed Item"}
                                                </ThemedText>
                                                <Text style={styles.productSKU}>SKU: {product.productSKU || "N/A"}</Text>
                                            </View>
                                            <ThemedText style={styles.productPrice}>
                                                Rs.{(Number(product.price) || 0).toFixed(2)}
                                            </ThemedText>
                                        </View>

                                        <Spacer height={8} />

                                        <View style={styles.productMeta}>
                                            <View style={[styles.metaTag, isLowStock && styles.metaTagWarning]}>
                                                <Ionicons name="cube-outline" size={11} color={isLowStock ? colors.primary : colors.primary} />
                                                <Text style={[styles.metaTagText, isLowStock && { color: colors.primary }]}>
                                                    {isLowStock ? 'Low stock' : 'In stock'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    <View style={styles.productActions}>
                                        <Pressable
                                            style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.actionButtonPressed]}
                                            onPress={() => handleEdit(product.$id)}
                                        >
                                            <Ionicons name="pencil-outline" size={16} color="#fff" />
                                        </Pressable>
                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.actionButton,
                                                styles.deleteButton,
                                                deletingId === product.$id && styles.actionButtonDisabled,
                                                pressed && styles.actionButtonPressed,
                                            ]}
                                            onPress={() => handleDelete(product.$id, product.productName)}
                                            disabled={deletingId === product.$id}
                                        >
                                            {deletingId === product.$id ? (
                                                <ActivityIndicator color="#fff" size={14} />
                                            ) : (
                                                <Ionicons name="trash-outline" size={16} color="#fff" />
                                            )}
                                        </Pressable>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : selectedCategory !== 'all' ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={48} color={colors.primary} style={{ opacity: 0.2 }} />
                        <ThemedText style={styles.emptyStateText}>No products in this category</ThemedText>
                        <Spacer height={16} />
                        <Pressable
                            style={styles.emptyStateButton}
                            onPress={() => setSelectedCategory('all')}
                        >
                            <Text style={styles.emptyStateButtonText}>View all products</Text>
                        </Pressable>
                    </View>
                ) : null}

                <Spacer height={30} />
            </ScrollView>
        </ThemedView>
    );
};

export default Products;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        flexGrow: 1,
    },
    headerSection: {
        marginBottom: 0,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        opacity: 0.5,
    },
    scanButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonPressed: {
        opacity: 0.8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    categoryBox: {
        width: '48%',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 140,
    },
    categoryBoxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    categoryBoxPressed: {
        opacity: 0.75,
    },
    categoryIconBox: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: colors.primary + '12',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIconBoxSelected: {
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    categoryBoxName: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    categoryBoxNameSelected: {
        color: '#fff',
    },
    categoryBoxBadge: {
        backgroundColor: colors.primary + '20',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        minWidth: 30,
        alignItems: 'center',
    },
    categoryBoxBadgeSelected: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    categoryBoxBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.primary,
    },
    categoryBoxBadgeTextSelected: {
        color: '#fff',
    },
    productsHeader: {
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
    productsTitle: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    productsList: {
        gap: 10,
    },
    productCard: {
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
    },
    productCardPressed: {
        opacity: 0.75,
    },
    stockBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.primary + '30',
        flexShrink: 0,
    },
    stockBadgeLow: {
        backgroundColor: colors.primary + '25',
        borderColor: colors.primary + '50',
    },
    stockBadgeText: {
        fontWeight: '800',
        fontSize: 16,
        color: colors.primary,
    },
    productContent: {
        flex: 1,
        minWidth: 0,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    productInfo: {
        flex: 1,
        minWidth: 0,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    productSKU: {
        fontSize: 11,
        opacity: 0.5,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.primary,
        flexShrink: 0,
    },
    productMeta: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    metaTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: colors.primary + '10',
    },
    metaTagWarning: {
        backgroundColor: colors.primary + '18',
    },
    metaTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    productActions: {
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    deleteButton: {
        backgroundColor: colors.primary + 'BB',
    },
    actionButtonPressed: {
        opacity: 0.75,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '700',
    },
    emptyStateButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.primary,
    },
    emptyStateButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
