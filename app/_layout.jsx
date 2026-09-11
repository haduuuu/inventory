import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/colors';
import { UserProvider } from '../contexts/UserContext';
import { ProductProvider } from '../contexts/ProductContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? colors.dark : colors.light;

    return (
        <LanguageProvider>
            <UserProvider>
                <ProductProvider>
                    <StatusBar style='auto' />
                    <Slot />
                </ProductProvider>
            </UserProvider>
        </LanguageProvider>
    );
}