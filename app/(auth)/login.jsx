import { TouchableWithoutFeedback, Keyboard, StyleSheet, Pressable, ActivityIndicator, Text } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import { colors } from '../../constants/colors'
import ThemedButton from '../../components/Themedbutton'
import ThemedInput from '../../components/ThemedInput'
import { useState, useEffect } from 'react'
import { useUser } from '../../hooks/useUser'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { login } = useUser()
    const router = useRouter()

    const handleSumit = async () => {
        setError(null)
        setLoading(true)
        try {
            await login(email, password)
            // Redirect to dashboard after successful login
            router.replace('/(dashboard)/dash')
        } catch (error) {
            setError(error.message || "Error logging in")
        } finally {
            setLoading(false)
        }
    }



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title1} title={true}> Login </ThemedText>
                <Spacer height={20} />
                <ThemedInput
                    style={{ width: '80%' }}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                    editable={!loading}
                />
                <ThemedInput
                    style={{ width: '80%' }}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                    editable={!loading}
                />

                <ThemedButton onPress={handleSumit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={{ textAlign: 'center', color: '#fff' }}> Login </ThemedText>
                    )}
                </ThemedButton>
                <Spacer height={10} />
                {error && <Text style={styles.error}>{error}</Text>}
                <ThemedText style={{ textAlign: 'center' }}>
                    <Link href="/(auth)/register"> Register instead </Link>
                    <Link href="/"> home </Link>
                </ThemedText>
            </ThemedView>
        </TouchableWithoutFeedback>
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
    },
    error: {
        color: colors.warning,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.warning + "20"
    }
})