import { StyleSheet, View, ScrollView, Pressable, Alert, useColorScheme, ActivityIndicator, Text } from "react-native";
import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import { colors } from "../../constants/colors";

const Products = () => {
    const { products, deleteProduct } = useProducts();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme] ?? colors.light;
    const [deletingId, setDeletingId] = useState(null);

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

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <ThemedText title={true} style={styles.title}>
                            Products
                        </ThemedText>
                        <Text style={styles.subtitle}>{products?.length ?? 0} items in stock</Text>
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.scanButton, pressed && styles.scanButtonPressed]}
                        onPress={() => router.push('/(dashboard)/scan?mode=lookup')}
                    >
                        <Ionicons name="barcode-outline" size={18} color="#fff" />
                    </Pressable>
                </View>

                <Spacer height={20} />

                {products && products.length > 0 ? (
                    <View style={styles.productsList}>
                        {products.map((product, idx) => {
                            const stockLevel = Number(product.stockLevel) || 0;
                            const isLowStock = stockLevel <= 5;
                            const category = product.category
                                ? product.category.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())
                                : 'Unassigned';

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

                                        <Spacer height={10} />

                                        <View style={styles.productMeta}>
                                            <View style={styles.metaTag}>
                                                <Ionicons name="folder-outline" size={12} color={colors.primary} />
                                                <Text style={styles.metaTagText}>{category}</Text>
                                            </View>
                                            <View style={[styles.metaTag, isLowStock && styles.metaTagWarning]}>
                                                <Ionicons name="cube-outline" size={12} color={isLowStock ? colors.primary : colors.primary} />
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
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={48} color={colors.primary} style={{ opacity: 0.2 }} />
                        <ThemedText style={styles.emptyStateText}>No products yet</ThemedText>
                        <Text style={styles.emptyStateSubtext}>Create your first product to get started</Text>
                    </View>
                )}

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
        paddingTop: 16,
        paddingBottom: 20,
        flexGrow: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        opacity: 0.5,
    },
    scanButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonPressed: {
        opacity: 0.8,
    },
    productsList: {
        gap: 12,
    },
    productCard: {
        borderRadius: 14,
        padding: 14,
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
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    productInfo: {
        flex: 1,
        marginRight: 8,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    productSKU: {
        fontSize: 12,
        opacity: 0.5,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.primary,
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
        paddingVertical: 80,
        gap: 12,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
    },
    emptyStateSubtext: {
        fontSize: 14,
        opacity: 0.5,
        textAlign: 'center',
    },
});
