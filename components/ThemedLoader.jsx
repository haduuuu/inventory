import { useColorScheme } from "react-native";
import { colors } from "../constants/colors";
import { ActivityIndicator } from "react-native";
import { Theme } from "react-native-appwrite";

const ThemedLoader = () => {
    const colorScheme = useColorScheme();
    const themeColors = colors[colorScheme] || colors.light;
    return (
        <ActivityIndicator size="large" color={themeColors.primary} />
    );
}

export default ThemedLoader;