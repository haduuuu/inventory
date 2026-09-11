import { StyleSheet, View, Text, Pressable, Alert, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useCallback } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useFocusEffect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import { useProducts } from '../../hooks/useProducts'
import { colors } from '../../constants/colors'

const CATEGORY_OPTIONS = [
    'electronics', 'furniture', 'apparel', 'health', 'beauty',
    'groceries', 'stationery', 'toys', 'sports', 'kitchenware',
    'tools', 'automotive', 'books', 'footwear', 'accessories',
    'home_decor', 'pet_supplies', 'office_supplies', 'other',
]

function guessCategory(rawCategory) {
    if (!rawCategory) return ''
    const text = rawCategory.toLowerCase()
    const found = CATEGORY_OPTIONS.find((option) => text.includes(option.replace('_', ' ')))
    return found || ''
}

const ScanBarcode = () => {
    const { mode = 'lookup' } = useLocalSearchParams()
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { products } = useProducts()

    const [permission, requestPermission] = useCameraPermissions()
    const [lookingUp, setLookingUp] = useState(false)
    const hasHandledScan = useRef(false)

    useFocusEffect(
        useCallback(() => {
            hasHandledScan.current = false
            setLookingUp(false)
        }, [])
    )

    const handleBarcodeScanned = async ({ data }) => {
        if (hasHandledScan.current) return
        hasHandledScan.current = true

        const existingMatch = (products || []).find((p) => p.productSKU === data)

        if (existingMatch) {
            if (mode === 'lookup') {
                router.replace(`/(dashboard)/edit?productId=${existingMatch.$id}`)
            } else {
                Alert.alert(
                    'Already in inventory',
                    `"${existingMatch.productName}" exists. Edit it instead?`,
                    [
                        {
                            text: 'Create anyway',
                            onPress: () => router.replace(`/(dashboard)/create?scannedSKU=${encodeURIComponent(data)}`),
                        },
                        {
                            text: 'Edit existing',
                            style: 'default',
                            onPress: () => router.replace(`/(dashboard)/edit?productId=${existingMatch.$id}`),
                        },
                    ]
                )
            }
            return
        }

        if (mode === 'create') {
            setLookingUp(true)

            let prefillName = ''
            let prefillCategory = ''

            try {
                const response = await fetch(
                    `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(data)}`
                )
                const json = await response.json()
                const item = json?.items?.[0]
                if (item) {
                    prefillName = item.title || item.brand || ''
                    prefillCategory = guessCategory(item.category)
                }
            } catch (err) {
                // Silent fallback
            }

            const params = new URLSearchParams({ scannedSKU: data })
            if (prefillName) params.set('scannedName', prefillName)
            if (prefillCategory) params.set('scannedCategory', prefillCategory)

            router.replace(`/(dashboard)/create?${params.toString()}`)
            return
        }

        Alert.alert(
            'Product not found',
            `Barcode "${data}" not in your inventory. Create it?`,
            [
                { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
                {
                    text: 'Create',
                    onPress: () => router.replace(`/(dashboard)/create?scannedSKU=${encodeURIComponent(data)}`),
                },
            ]
        )
    }

    if (!permission) {
        return <ThemedView style={styles.centered} />
    }

    if (!permission.granted) {
        return (
            <ThemedView style={styles.centered}>
                <Ionicons name="camera-outline" size={56} color={colors.primary} />
                <ThemedText style={styles.permissionTitle}>Camera Access Needed</ThemedText>
                <Text style={styles.permissionText}>
                    We need permission to scan barcodes from your device camera.
                </Text>
                <Pressable style={styles.permissionButton} onPress={requestPermission}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                    <Text style={styles.permissionButtonText}>Grant Access</Text>
                </Pressable>
                <Pressable style={styles.cancelLink} onPress={() => router.back()}>
                    <ThemedText style={styles.cancelLinkText}>Cancel</ThemedText>
                </Pressable>
            </ThemedView>
        )
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />

            {/* Overlay Gradient */}
            <View style={styles.overlayGradient} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </Pressable>
                <ThemedText style={styles.headerTitle}>
                    {mode === 'create' ? 'Scan Barcode' : 'Find Product'}
                </ThemedText>
                <View style={{ width: 32 }} />
            </View>

            {/* Scan Frame */}
            <View style={styles.frameContainer} pointerEvents="none">
                <View style={styles.frameBracketTopLeft} />
                <View style={styles.frameBracketTopRight} />
                <View style={styles.frame} />
                <View style={styles.frameBracketBottomLeft} />
                <View style={styles.frameBracketBottomRight} />
            </View>

            {/* Instructions */}
            <View style={styles.instructions} pointerEvents="none">
                <Ionicons name="scan-outline" size={20} color="rgba(255,255,255,0.7)" />
                <Text style={styles.instructionsText}>Center barcode in frame</Text>
            </View>

            {/* Looking Up Overlay */}
            {lookingUp && (
                <View style={styles.lookupOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.lookupText}>Looking up product details...</Text>
                </View>
            )}
        </View>
    )
}

export default ScanBarcode

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    overlayGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingBottom: 12,
        zIndex: 10,
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    frameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    frame: {
        width: 280,
        height: 180,
        borderWidth: 2.5,
        borderColor: colors.primary,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    frameBracketTopLeft: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: colors.primary,
        top: 'calc(50% - 90px)',
        left: 'calc(50% - 140px)',
        borderTopLeftRadius: 4,
    },
    frameBracketTopRight: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: colors.primary,
        top: 'calc(50% - 90px)',
        right: 'calc(50% - 140px)',
        borderTopRightRadius: 4,
    },
    frameBracketBottomLeft: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: colors.primary,
        bottom: 'calc(50% - 90px)',
        left: 'calc(50% - 140px)',
        borderBottomLeftRadius: 4,
    },
    frameBracketBottomRight: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: colors.primary,
        bottom: 'calc(50% - 90px)',
        right: 'calc(50% - 140px)',
        borderBottomRightRadius: 4,
    },
    instructions: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 8,
        zIndex: 10,
    },
    instructionsText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '500',
    },
    permissionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 8,
    },
    permissionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    permissionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    cancelLink: {
        paddingVertical: 8,
    },
    cancelLinkText: {
        opacity: 0.5,
        fontSize: 14,
    },
    lookupOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        zIndex: 20,
    },
    lookupText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
})
