import { StyleSheet } from "react-native";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
const Create = () => {
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title1} title={true}> your email </ThemedText>
            <Spacer height={20} />
            <ThemedText style={styles.title1} title={true}> lets start reading books</ThemedText>
        </ThemedView>
    )
}
export default Create
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
    , title1: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20
    },
})