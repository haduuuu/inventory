
import { Client, Account, Avatars, Databases } from 'react-native-appwrite';
import { Platform } from 'react-native';

const client = new Client();

client.setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('697da99a000b7ae677d2'); // Replace with your project ID

if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // Running on native app
    client.setPlatform('dev.samidha.inventory');
} else {
    // Running on web
    client.setPlatform('mobile-app');
}

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);