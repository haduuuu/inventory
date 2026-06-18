import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useProducts } from "../../hooks/useProducts";
import { useRouter } from "expo-router";

// Custom Themed Components
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";

// Fallback styling colors (Matches your database schema usage)
const colors = {
    primary: "#007AFF",
    danger: "#e74c3c",
    cardBg: "#f9f9f9"
};

const Products = () => {
    const { products } = useProducts();
    const router = useRouter();

    const handleEdit = (productId) => {
        // Navigate to your edit form route when pressed
        router.push(`/(dashboard)/products/edit/${productId}`);
    };

    const handleDelete = async (productId) => {
        console.log("Delete product triggered for ID:", productId);
        // Implement your hook's delete execution here if required
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <ThemedText style={styles.title} title={true}>
                    Products
                </ThemedText>
                <Spacer height={20} />

                {products && products.length > 0 ? (
                    <View>
                        {products.map((product) => (
                            <View key={product.$id || product.id} style={[styles.productCard, { backgroundColor: colors.cardBg }]}>

                                {/* Product Title and Price Header Line */}
                                <View style={styles.productHeader}>
                                    <ThemedText style={styles.productName}>
                                        {product.productName || "Unnamed Item"}
                                    </ThemedText>
                                    <ThemedText style={styles.productPrice}>
                                        Rs. {product.price || "0.00"}
                                    </ThemedText>
                                </View>

                                <Spacer height={8} />

                                {/* Product Category Identifier */}
                                <ThemedText style={styles.productDescription}>
                                    Category: {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Unassigned"}
                                </ThemedText>

                                <Spacer height={10} />

                                {/* Stock Levels and Meta Identifiers */}
                                <View style={styles.productMeta}>
                                    <ThemedText style={styles.metaText}>
                                        SKU: {product.productSKU || "N/A"}
                                    </ThemedText>
                                    <ThemedText style={[styles.metaText, { fontWeight: "600", color: product.stockLevel < 5 ? colors.danger : "#333" }]}>
                                        Stock: {product.stockLevel || 0} units
                                    </ThemedText>
                                </View>

                                <Spacer height={15} />

                                {/* Action Buttons Panel */}
                                <View style={styles.actionButtons}>
                                    <Pressable
                                        style={[styles.button, { backgroundColor: colors.primary }]}
                                        onPress={() => handleEdit(product.$id)}
                                    >
                                        <ThemedText style={styles.buttonText}>Edit</ThemedText>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.button, { backgroundColor: colors.danger }]}
                                        onPress={() => handleDelete(product.$id)}
                                    >
                                        <ThemedText style={styles.buttonText}>Delete</ThemedText>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    /* Fallback Empty Placeholder UI Gate */
                    <View style={styles.emptyState}>
                        <ThemedText style={styles.emptyStateText}>
                            No products yet 📦
                        </ThemedText>
                        <Spacer height={10} />
                        <ThemedText style={styles.emptyStateSubtext}>
                            Create your first product from the Create tab
                        </ThemedText>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    productCard: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#eee",
    },
    productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.primary,
    },
    productDescription: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 20,
    },
    productMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    metaText: {
        fontSize: 13,
        opacity: 0.6,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    emptyStateSubtext: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: "center",
        marginTop: 5,
    },
});