import { StyleSheet, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useUser } from "../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons"; // Added in case you need icons later
import { colors } from "../../constants/colors"; // Assuming you use this for styling

import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedInput from "../../components/ThemedInput";
import ThemedButton from "../../components/Themedbutton";
import ThemedLoader from "../../components/ThemedLoader";

const Create = () => {
    const { user, authChecked } = useUser();
    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [productSKU, setProductSKU] = useState('');
    const [price, setPrice] = useState('');
    const [stockLevel, setStockLevel] = useState('');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date().toISOString());
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Valid Appwrite enum options
    const categoryOptions = ['electronics', 'furniture', 'apparel', 'health', 'beauty'];

    const { createProduct } = useProducts();

    // Route Guard
    useEffect(() => {
        if (authChecked && !user) {
            router.replace("/(auth)/login");
        }
    }, [authChecked, user, router]);

    const handleSubmit = async () => {
        // Basic validation
        if (!productName.trim() || !productSKU.trim() || !price.trim() || !category) return;

        try {
            setLoading(true);

            await createProduct({
                productName: productName.trim(),
                productSKU: productSKU.trim(),
                price: parseFloat(price),
                stockLevel: parseInt(stockLevel) || 0,
                category: category.trim(),
                expiry_date: expiryDate
            }, user);

            setProductName('');
            setProductSKU('');
            setPrice('');
            setStockLevel('');
            setCategory('');

            router.replace("/products");
        } catch (error) {
            console.error("Form Submission Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                {!authChecked ? (
                    <ThemedLoader />
                ) : (
                    <>
                        <ThemedText style={styles.title1} title={true}>Create Product</ThemedText>
                        <Spacer height={15} />

                        <ThemedInput style={{ width: '80%' }} placeholder="Product Name" onChangeText={setProductName} value={productName} />
                        <ThemedInput style={{ width: '80%' }} placeholder="SKU / Barcode" onChangeText={setProductSKU} value={productSKU} />
                        <ThemedInput style={{ width: '80%' }} placeholder="Price" keyboardType="numeric" onChangeText={setPrice} value={price} />
                        <ThemedInput style={{ width: '80%' }} placeholder="Stock Quantity" keyboardType="number-pad" onChangeText={setStockLevel} value={stockLevel} />

                        {/* Custom Dropdown */}
                        <TouchableOpacity
                            style={[styles.dropdown, { width: '80%' }]}
                            onPress={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <Text style={styles.dropdownText}>
                                {/* Capitalize the first letter for the UI display if a category is selected */}
                                {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Select Category'}
                            </Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>

                        {dropdownOpen && (
                            <View style={[styles.dropdownList, { width: '80%' }]}>
                                {categoryOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setCategory(option); // Saves lowercase to match Appwrite
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {/* Capitalize the first letter for the dropdown list visually */}
                                        <Text style={styles.dropdownItemText}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Spacer height={20} />

                        <ThemedButton onPress={handleSubmit} disabled={loading}>
                            {loading ? (
                                <ThemedLoader />
                            ) : (
                                <ThemedText style={{ textAlign: 'center', color: '#fff' }}>
                                    Create Product
                                </ThemedText>
                            )}
                        </ThemedButton>
                    </>
                )}
            </ThemedView>
        </TouchableWithoutFeedback>
    );
};

export default Create;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title1: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20
    },
    dropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#666',
    },
    dropdownList: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        maxHeight: 200, // Keeps the list from getting too long on small screens
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
});