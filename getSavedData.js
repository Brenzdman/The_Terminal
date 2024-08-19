import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Firebase using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function getChosenNames() {
  const collectionName = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_NAME;
  if (!collectionName) {
    throw new Error("Collection name is not defined in environment variables");
  }

  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    const chosenNames = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.chosen_name) {
        chosenNames.push(data.chosen_name);
      }
    });

    console.log("Chosen Names:", chosenNames);
    return chosenNames;
  } catch (error) {
    console.error("Error fetching chosen names:", error);
  }
}

// Call the function
getChosenNames();
