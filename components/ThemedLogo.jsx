import { Image, useColorScheme } from "react-native"
import React from "react"

import DarkLogo from "../assets/adaptive-icon.png"
import LightLogo from "../assets/icon.png"

const ThemedLogo = ({ ...props }) => {
    const colorScheme = useColorScheme()
    const logoSource = colorScheme === "dark" ? DarkLogo : LightLogo

    return (<Image source={logoSource} style={{ width: 100, height: 100 }} {...props} />)
}

export default ThemedLogo