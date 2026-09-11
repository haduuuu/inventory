import { StyleSheet, View, ScrollView, Text, Pressable, ActivityIndicator, Alert, useColorScheme } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContext, useState, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../constants/localization";
import { colors } from "../../constants/colors";
import { ProductContext } from "../../contexts/ProductContext";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedInput from "../../components/ThemedInput";

const CATEGORY_OPTIONS = [
    'electronics', 'furniture', 'apparel', 'health', 'beauty',
    'groceries', 'stationery', 'toys', 'sports', 'kitchenware',
    'tools', 'automotive', 'books', 'footwear', 'accessories',
    'home_decor', 'pet_supplies', 'office_supplies', 'other',
];

const Edit = () => {
    const { products, updateProduct, deleteProduct } = useContext(ProductContext);
    const { productId } = useLocalSearchParams();
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme] ?? colors.light;
    const { language } = useLanguage();

    const product = products?.find(p => p.$id === productId);

    const [productName, setProductName] = useState("");
    const [productSKU, setProductSKU] = useState("");
    const [price, setPrice] = useState("");
    const [stockLevel, setStockLevel] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        if (product) {
            setProductName(product.productName || "");
            setProductSKU(product.productSKU || "");
            setPrice(String(product.price || ""));
            setStockLevel(String(product.stockLevel || ""));
            setCategory(product.category || "");
        }
    }, [product]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProduct(productId, {
                productName: productName.trim(),
                productSKU: productSKU.trim(),
                price: parseFloat(price) || 0,
                stockLevel: parseInt(stockLevel) || 0,
                category: category.trim(),
            });
            router.back();
        } catch (error) {
            Alert.alert(t(language, 'error_title'), error.message || t(language, 'error_try_again'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            t(language, 'edit_delete'),
            `${t(language, 'edit_delete_confirm')} "${productName || 'this product'}"?\n${t(language, 'edit_delete_warning')}`,
            [
                { text: t(language, 'cancel'), style: 'cancel' },
                {
                    text: t(language, 'delete'),
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteProduct(productId);
                            router.replace('/(dashboard)/products');
                        } catch (error) {
                            Alert.alert(t(language, 'error_couldnt_delete'), error.message || t(language, 'error_try_again'));
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (!product) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Custom Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.navbackground }]}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerButton}>
                    <Ionicons name="chevron-back" size={26} color={theme.title} />
                </Pressable>
                <ThemedText title={true} style={styles.headerTitle}>
                    {t(language, 'edit_title')}
                </ThemedText>
                <View style={styles.headerRight}>
                    <LanguageSwitcher />
                    <Pressable onPress={handleDelete} hitSlop={12} disabled={loading}>
                        <Ionicons name="trash-outline" size={24} color={colors.primary} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Form Section */}
                <View style={styles.formSection}>
                    <View style={[styles.inputCard, { backgroundColor: theme.unibackground }]}>
                        <FormField
                            icon="text-outline"
                            label={t(language, 'create_product_name')}
                            placeholder={t(language, 'create_product_name_hint')}
                            value={productName}
                            onChangeText={setProductName}
                            editable={!loading}
                        />
                        <Divider />
                        <FormField
                            icon="barcode-outline"
                            label={t(language, 'create_sku_barcode')}
                            placeholder={t(language, 'create_sku_hint')}
                            value={productSKU}
                            onChangeText={setProductSKU}
                            editable={!loading}
                        />
                        <Divider />
                        <FormField
                            icon="cash-outline"
                            label={t(language, 'create_price')}
                            placeholder={t(language, 'create_price_hint')}
                            keyboardType="decimal-pad"
                            value={price}
                            onChangeText={setPrice}
                            editable={!loading}
                        />
                        <Divider />
                        <FormField
                            icon="layers-outline"
                            label={t(language, 'create_stock_quantity')}
                            placeholder={t(language, 'create_stock_hint')}
                            keyboardType="number-pad"
                            value={stockLevel}
                            onChangeText={setStockLevel}
                            editable={!loading}
                        />
                    </View>

                    <Spacer height={16} />

                    {/* Category Selector */}
                    <View style={styles.categorySection}>
                        <ThemedText style={styles.categoryLabel}>
                            {t(language, 'create_category')}
                        </ThemedText>
                        <View style={styles.dropdownWrapper}>
                            <Pressable
                                style={[styles.dropdown, { backgroundColor: theme.unibackground }]}
                                onPress={() => setDropdownOpen(!dropdownOpen)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.dropdownLabelRow}>
                                    <Ionicons name="folder-outline" size={16} color={colors.primary} />
                                    <Text style={styles.dropdownText}>
                                        {category ? category.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) : t(language, 'create_select_category')}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={colors.primary}
                                />
                            </Pressable>

                            {dropdownOpen && (
                                <View style={[styles.dropdownList, { backgroundColor: theme.unibackground }]}>
                                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <Pressable
                                                key={option}
                                                style={({ pressed }) => [
                                                    styles.dropdownItem,
                                                    category === option && styles.dropdownItemSelected,
                                                    pressed && styles.dropdownItemPressed,
                                                ]}
                                                onPress={() => {
                                                    setCategory(option);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <Text style={[styles.dropdownItemText, category === option && styles.dropdownItemTextSelected]}>
                                                    {option.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                                                </Text>
                                                {category === option && (
                                                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                                                )}
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <Spacer height={20} />

                {/* Save Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.submitButton,
                        { backgroundColor: colors.primary },
                        (loading || pressed) && styles.submitButtonPressed,
                    ]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                            <ThemedText style={styles.submitButtonText}>
                                {t(language, 'edit_save')}
                            </ThemedText>
                        </>
                    )}
                </Pressable>

                <Spacer height={12} />

                <Pressable
                    style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.6 }]}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <ThemedText style={styles.cancelButtonText}>
                        {t(language, 'cancel')}
                    </ThemedText>
                </Pressable>

                <Spacer height={40} />
            </ScrollView>
        </ThemedView>
    );
};

const FormField = ({ icon, label, ...inputProps }) => (
    <View style={styles.field}>
        <View style={styles.fieldLabelRow}>
            <Ionicons name={icon} size={15} color={colors.primary} style={styles.fieldIcon} />
            <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
        </View>
        <ThemedInput style={styles.fieldInput} {...inputProps} />
    </View>
);

const Divider = () => <View style={styles.divider} />;

export default Edit;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingBottom: 14,
    },
    headerButton: {
        width: 32,
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formSection: {
        gap: 16,
    },
    inputCard: {
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    field: {
        paddingVertical: 12,
    },
    fieldLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    fieldIcon: {},
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        opacity: 0.65,
    },
    fieldInput: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },
    categorySection: {
        gap: 8,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        opacity: 0.65,
        paddingHorizontal: 4,
    },
    dropdownWrapper: {
        position: 'relative',
        zIndex: 20,
    },
    dropdown: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    dropdownText: {
        fontSize: 15,
        fontWeight: '500',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 6,
        borderRadius: 12,
        maxHeight: 240,
        zIndex: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    dropdownItemSelected: {
        backgroundColor: colors.primary + '08',
    },
    dropdownItemPressed: {
        opacity: 0.6,
    },
    dropdownItemText: {
        fontSize: 15,
    },
    dropdownItemTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        borderRadius: 12,
    },
    submitButtonPressed: {
        opacity: 0.8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    cancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        opacity: 0.5,
        fontWeight: '600',
    },
});
