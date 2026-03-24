import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import { colors } from '../../constants/colors'
import ThemedButton from '../../components/Themedbutton'

const Login = () => {
    const handlepress = () => {
        console.log("Login Pressed")
    }
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title1} title={true}> Login </ThemedText>
            <Spacer height={20} />
            <ThemedButton onPress={handlepress} >
                <ThemedText style={{ textAlign: 'center', color: '#fff' }}> Login </ThemedText>
            </ThemedButton>
            <ThemedText style={{ textAlign: 'center' }}>
                <Link href="/register"> Register instead </Link>
                <Link href="/"> home </Link>
            </ThemedText>
        </ThemedView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
    , title1: {
        fontSize: 18,
        marginBottom: 20,
    },
    btn: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    pressed: {
        opacity: 0.7,
    }
})