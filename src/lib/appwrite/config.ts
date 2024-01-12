import { Client, Databases, Account, Storage, Avatars } from "appwrite";

export const appwriteConfig = { 
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url:import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionID: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionID: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    savesCollectionID: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}



export const client = new Client();


client
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);    
export const storage = new Storage(client);
export const avatars = new Avatars(client);
