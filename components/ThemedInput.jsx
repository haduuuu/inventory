import { useColorScheme, TextInput } from 'react-native'
import React from 'react'
import { colors }
    from '../constants/colors'
const ThemedInput = ({ style, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light
    return (
        <TextInput
            style={[{ backgroundColor: theme.inputBackground, color: theme.text, padding: 20, borderRadius: 6 }, style]}
            placeholderTextColor={theme.placeholder}
            {...props}
        />
    )
}

export default ThemedInput
