import { Pressable } from "react-native";
import { colors } from "../constants/colors";

const ThemedButton = ({ style, ...props }) => {
    return (
        <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]} {...props} />
    )
}
export default ThemedButton

const styles = {
    btn: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    pressed: {
        opacity: 0.7,
    }
}