import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    Text,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Pressable,
    useColorScheme,
} from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedInput from '../../components/ThemedInput'
import Spacer from '../../components/Spacer'
import { useProducts } from '../../hooks/useProducts'
import { colors } from '../../constants/colors'

// Keep this in sync with the "category" enum values configured in your Appwrite table
const CATEGORY_OPTIONS = [
    'electronics',
    'furniture',
    'apparel',
    'health',
    'beauty',
    'groceries',
    'stationery',
    'toys',
    'sports',
    'kitchenware',
    'tools',
    'automotive',
    'books',
    'footwear',
    'accessories',
    'home_decor',
    'pet_supplies',
    'office_supplies',
    'other',
]

const EditProduct = () => {
    const { productId } = useLocalSearchParams()
    const router = useRouter()
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
    const { fetchProductsById, updateProduct, deleteProduct } = useProducts()

    // This screen renders its own header, so hide the default navigator one
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [navigation])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const [productName, setProductName] = useState('')
    const [productSKU, setProductSKU] = useState('')
    const [price, setPrice] = useState('')
    const [stockLevel, setStockLevel] = useState('')
    const [category, setCategory] = useState('')
    const [expiryDate, setExpiryDate] = useState('') // expects YYYY-MM-DD

    useEffect(() => {
        let isMounted = true
        async function load() {
            try {
                const product = await fetchProductsById(productId)
                if (!isMounted || !product) return
                setProductName(product.productName ?? '')
                setProductSKU(product.productSKU ?? '')
                setPrice(String(product.price ?? ''))
                setStockLevel(String(product.stockLevel ?? ''))
                setCategory(product.category ?? '')
                setExpiryDate(product.expiry_date ? product.expiry_date.split('T')[0] : '')
            } catch (err) {
                setError(err.message || 'Could not load this product')
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        load()
        return () => { isMounted = false }
    }, [productId])

    const handleSave = async () => {
        setError(null)

        if (!productName.trim() || !productSKU.trim()) {
            setError('Product name and SKU are required')
            return
        }
        const priceNum = Number(price)
        const stockNum = Number(stockLevel)
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            setError('Enter a valid price')
            return
        }
        if (!Number.isInteger(stockNum) || stockNum < 0) {
            setError('Enter a valid stock level')
            return
        }

        setSaving(true)
        try {
            await updateProduct(productId, {
                productName: productName.trim(),
                productSKU: productSKU.trim(),
                price: priceNum,
                stockLevel: stockNum,
                category,
                expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
            })
            router.back()
        } catch (err) {
            setError(err.message || 'Could not save changes')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete product',
            `Are you sure you want to delete "${productName || 'this product'}"? This can't be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setSaving(true)
                        try {
                            await deleteProduct(productId)
                            router.replace('/(dashboard)/products')
                        } catch (err) {
                            setError(err.message || 'Could not delete product')
                            setSaving(false)
                        }
                    },
                },
            ]
        )
    }

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </ThemedView>
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                {/* Custom header */}
                <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.navbackground }]}>
                    <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerIconButton}>
                        <Ionicons name="chevron-back" size={26} color={theme.title} />
                    </Pressable>
                    <ThemedText title={true} style={styles.headerTitle} numberOfLines={1}>
                        Edit product
                    </ThemedText>
                    <Pressable onPress={handleDelete} hitSlop={12} style={styles.headerIconButton} disabled={saving}>
                        <Ionicons name="trash-outline" size={22} color={colors.primary} />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={[styles.card, { backgroundColor: theme.unibackground }]}>
                        <Field
                            icon="pricetag-outline"
                            label="Product name"
                            value={productName}
                            onChangeText={setProductName}
                            placeholder="e.g. Oak dining chair"
                            editable={!saving}
                        />
                        <Divider />
                        <Field
                            icon="barcode-outline"
                            label="SKU"
                            value={productSKU}
                            onChangeText={setProductSKU}
                            placeholder="e.g. FUR-0021"
                            editable={!saving}
                        />
                        <Divider />
                        <Field
                            icon="cash-outline"
                            label="Price (Rs.)"
                            value={price}
                            onChangeText={setPrice}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            editable={!saving}
                        />
                        <Divider />
                        <Field
                            icon="cube-outline"
                            label="Stock level"
                            value={stockLevel}
                            onChangeText={setStockLevel}
                            placeholder="0"
                            keyboardType="number-pad"
                            editable={!saving}
                        />
                        <Divider />
                        <View style={styles.field}>
                            <View style={styles.fieldLabelRow}>
                                <Ionicons name="folder-outline" size={15} color={colors.primary} style={styles.fieldIcon} />
                                <ThemedText style={styles.fieldLabel}>Category</ThemedText>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.chipRow}
                            >
                                {CATEGORY_OPTIONS.map((option) => {
                                    const selected = category === option
                                    return (
                                        <Pressable
                                            key={option}
                                            onPress={() => setCategory(option)}
                                            disabled={saving}
                                            style={[
                                                styles.chip,
                                                selected && { backgroundColor: colors.primary },
                                            ]}
                                        >
                                            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                                                {option.replace('_', ' ')}
                                            </Text>
                                        </Pressable>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <Divider />
                        <Field
                            icon="calendar-outline"
                            label="Expiry date"
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            placeholder="YYYY-MM-DD"
                            editable={!saving}
                        />
                    </View>

                    {error && (
                        <>
                            <Spacer height={16} />
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle" size={16} color={colors.primary} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        </>
                    )}

                    <Spacer height={24} />

                    <Pressable
                        style={({ pressed }) => [
                            styles.saveButton,
                            { backgroundColor: colors.primary },
                            (saving || pressed) && styles.pressed,
                        ]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                                <Text style={styles.saveButtonText}>Save changes</Text>
                            </>
                        )}
                    </Pressable>

                    <Spacer height={12} />

                    <Pressable
                        style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
                        onPress={() => router.back()}
                        disabled={saving}
                    >
                        <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                    </Pressable>
                </ScrollView>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

// Small labeled input row with a leading icon, reused for every field above
const Field = ({ icon, label, ...inputProps }) => (
    <View style={styles.field}>
        <View style={styles.fieldLabelRow}>
            <Ionicons name={icon} size={15} color={colors.primary} style={styles.fieldIcon} />
            <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
        </View>
        <ThemedInput style={styles.fieldInput} {...inputProps} />
    </View>
)

const Divider = () => <View style={styles.divider} />

export default EditProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingBottom: 14,
    },
    headerIconButton: {
        width: 32,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
    },
    card: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    field: {
        paddingVertical: 10,
    },
    fieldLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    fieldIcon: {
        marginRight: 6,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.65,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    fieldInput: {
        backgroundColor: 'transparent',
    },
    chipRow: {
        gap: 8,
        paddingVertical: 2,
        paddingRight: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(120,120,120,0.15)',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
        color: '#666',
    },
    chipTextSelected: {
        color: '#fff',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(120,120,120,0.25)',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 4,
    },
    errorText: {
        color: '#a6231f',
        fontSize: 13,
        flexShrink: 1,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        borderRadius: 14,
    },
    saveButtonText: {
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
        opacity: 0.6,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.75,
    },
})
