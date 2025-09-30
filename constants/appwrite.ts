// Appwrite client configuration for React Native/Expo
import { Client, Account, Storage, Databases } from 'appwrite';

const appwrite = {
  client: new Client(),
  account: null as Account | null,
  storage: null as Storage | null,
  databases: null as Databases | null,
};

appwrite.client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);


appwrite.account = new Account(appwrite.client);
appwrite.storage = new Storage(appwrite.client);
appwrite.databases = new Databases(appwrite.client);

export default appwrite;
