import { StyleSheet, TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/Themedbutton'
import ThemedInput from '../../components/ThemedInput'
import { useState, useEffect } from 'react'
import { useUser } from "../../hooks/useUser"
import { colors } from '../../constants/colors'

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { register } = useUser()
    const router = useRouter()

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        try {
            await register(email, password)
            // Redirect to dashboard after successful registration
            router.replace('/(dashboard)/dash')
        } catch (error) {
            setError(error.message || "Error registering user")
        } finally {
            setLoading(false)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title1} title={true}> register </ThemedText>
                <Spacer height={20} />
                <ThemedInput style={{ width: '80%' }} placeholder="Email" keyboardType="email-address" onChangeText={setEmail} value={email} />
                <ThemedInput style={{ width: '80%' }} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
                <ThemedButton onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={{ textAlign: 'center', color: '#fff' }}> Register </ThemedText>
                    )}
                </ThemedButton>
                <Spacer height={10} />
                {error && <Text style={styles.error}>{error}</Text>}

                <ThemedText style={{ textAlign: 'center' }}>
                    <Link href="/(auth)/login"> login instead </Link>
                </ThemedText>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    title1: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
    error: {
        color: 'red',
        marginTop: 10
    }
})

export default Register