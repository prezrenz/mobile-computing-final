import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

const firebaseConfig: FirebaseOptions = {
	apiKey: environment.firebase.apiKey,
	projectId: environment.firebase.projectId,
	appId: environment.firebase.appId,
	storageBucket: environment.firebase.storageBucket,
	messagingSenderId: environment.firebase.messagingSenderId,
	authDomain: environment.firebase.authDomain
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
	persistence: indexedDBLocalPersistence
});

export { db, auth };
