import { StyleSheet, View, Pressable, Modal, Text } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../contexts/LanguageContext'
import ThemedText from './ThemedText'
import { colors } from '../constants/colors'

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage()
    const [showModal, setShowModal] = useState(false)

    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage)
        setShowModal(false)
    }

    return (
        <>
            {/* Language Button */}
            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={() => setShowModal(true)}
                hitSlop={12}
            >
                <Ionicons
                    name="language-outline"
                    size={20}
                    color={colors.primary}
                />
                <ThemedText style={styles.buttonLabel}>
                    {language === 'en' ? 'EN' : 'ने'}
                </ThemedText>
            </Pressable>

            {/* Language Selection Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowModal(false)}
                >
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>
                            Select Language / भाषा छान्नुहोस्
                        </ThemedText>

                        <Pressable
                            style={({ pressed }) => [
                                styles.languageOption,
                                language === 'en' && styles.languageOptionActive,
                                pressed && styles.languageOptionPressed,
                            ]}
                            onPress={() => handleLanguageChange('en')}
                        >
                            <Ionicons
                                name={language === 'en' ? 'radio-button-on' : 'radio-button-off'}
                                size={20}
                                color={language === 'en' ? colors.primary : colors.primary}
                            />
                            <View style={styles.languageOptionText}>
                                <Text style={[styles.languageName, language === 'en' && styles.languageNameActive]}>
                                    English
                                </Text>
                                <Text style={styles.languageNative}>अंग्रेजी</Text>
                            </View>
                            {language === 'en' && (
                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                            )}
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.languageOption,
                                language === 'ne' && styles.languageOptionActive,
                                pressed && styles.languageOptionPressed,
                            ]}
                            onPress={() => handleLanguageChange('ne')}
                        >
                            <Ionicons
                                name={language === 'ne' ? 'radio-button-on' : 'radio-button-off'}
                                size={20}
                                color={language === 'ne' ? colors.primary : colors.primary}
                            />
                            <View style={styles.languageOptionText}>
                                <Text style={[styles.languageName, language === 'ne' && styles.languageNameActive]}>
                                    नेपाली
                                </Text>
                                <Text style={styles.languageNative}>Nepali</Text>
                            </View>
                            {language === 'ne' && (
                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                            )}
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

export default LanguageSwitcher

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        gap: 12,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: colors.primary + '08',
        borderWidth: 1.5,
        borderColor: colors.primary + '20',
    },
    languageOptionActive: {
        backgroundColor: colors.primary + '15',
        borderColor: colors.primary + '50',
    },
    languageOptionPressed: {
        opacity: 0.7,
    },
    languageOptionText: {
        flex: 1,
        gap: 2,
    },
    languageName: {
        fontSize: 14,
        fontWeight: '600',
    },
    languageNameActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    languageNative: {
        fontSize: 12,
        opacity: 0.5,
    },
    closeButton: {
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    closeButtonPressed: {
        opacity: 0.6,
    },
    closeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
})
