import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'
import { useUser } from '../hooks/useUser' // 👈 Imported your global user hook

const Home = () => {
    const { user, loading } = useUser() // 👈 Destructured user state
    const router = useRouter() // 👈 Hook to control navigation programmatically

    useEffect(() => {
        // If the auth system isn't loading and a user profile exists...
        if (!loading && user) {
            // Change this from '/(dashboard)/dash' to '/(dashboard)/dashboard'
            router.replace('/(dashboard)/dash')
        }
    }, [user, loading])

    // While checking authentication state, we can return a blank view or splash screen 
    if (loading) {
        return <ThemedView style={styles.container} />
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedLogo style={styles.image} />
            <ThemedText style={styles.title1} title={true}> Hi </ThemedText>
            <Text style={styles.title2}>whats up</Text>
            <Spacer />
            <Text>spacer check</Text>

            <View style={styles.card}>
                <Text> come back soon ok </Text>
            </View>

            <View style={styles.card}>
                <Link href="/about">Go to about page</Link>
                <Link href="/contact">Go to contact page</Link>
            </View>
            <View style={styles.card}>
                <Link href="/login">Go to login page</Link>
                <Link href="/register">Go to register page</Link>
            </View>
            <View style={styles.card}>
                <Link href="/create">Go to create page</Link>
                <Link href="/products">Go to products page</Link>
                <Link href="/profile">Go to profile page</Link>
                <Link href="/(dashboard)/dashboard">Go to dashboard</Link>
            </View>
        </ThemedView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fb0202',
    },
    title2: {
        marginTop: 10,
        fontSize: 16,
        fontStyle: 'italic',
        color: '#420a0a',
    },
    card: {
        backgroundColor: '#e5dbdb',
        padding: 20,
        borderRadius: 90,
        shadowColor: '#fb1616',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 0.8,
        elevation: 50,
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#fb0202',
    },
    link: {
        borderBottomWidth: 1,
        marginVertical: 1,
        color: 'blue',
    }
})