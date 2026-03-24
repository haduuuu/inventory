import { View, useColorScheme } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

const ThemedCard = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = colors[colorScheme] || colors.light
  return (
    <View style={[{ backgroundColor: theme.unibackground }, style]} {...props} />

  )
}

export default ThemedCard

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10
  }
})