import { StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/Themedbutton'


const Register = () => {
    const handlepress = () => {
        console.log("Register Pressed")
    }
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title1} title={true}> register </ThemedText>
            <Spacer height={20} />
            <ThemedButton onPress={handlepress} >
                <ThemedText style={{ textAlign: 'center', color: '#fff' }}> Register </ThemedText>
            </ThemedButton>

            <ThemedText style={{ textAlign: 'center' }}>
                <Link href="/login"> login instead </Link>
            </ThemedText>

        </ThemedView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
    , title1: {
        fontSize: 18,
        marginBottom: 20
    },
})