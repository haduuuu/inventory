import { View, useColorScheme } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

const ThemedView = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = colors[colorScheme] || colors.light
  return (
    <View style={[{ backgroundColor: theme.background }, style]} {...props} />

  )
}

export default ThemedView