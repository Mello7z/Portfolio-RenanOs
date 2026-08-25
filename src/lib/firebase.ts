import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use the designated Firestore Database ID from configuration
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Types
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  createdAt: any;
}

export interface ScoreItem {
  id?: string;
  game: string;
  playerName: string;
  score: number;
  createdAt: any;
}

// Contacts API
export async function sendContactMessage(data: { name: string; email: string; message: string }) {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...data,
      createdAt: serverTimestamp(),
      isoDate: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact to Firebase:', error);
    throw error;
  }
}

// Notes API
export async function createNote(title: string, body: string) {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      title,
      body,
      createdAt: serverTimestamp(),
      isoDate: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

export async function removeNote(noteId: string) {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

export function subscribeToNotes(callback: (notes: NoteItem[]) => void) {
  const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes: NoteItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          title: data.title || 'Sem título',
          body: data.body || '',
          createdAt: data.createdAt ? data.createdAt.toDate?.() || new Date() : new Date()
        });
      });
      callback(notes);
    },
    (err) => {
      console.warn('Notes snapshot listener error, falling back to local:', err);
    }
  );
}

// Scores / Leaderboard API
export async function submitScore(game: string, playerName: string, score: number) {
  try {
    const docRef = await addDoc(collection(db, 'scores'), {
      game,
      playerName: playerName || 'CYBER_OPERATIVE',
      score,
      createdAt: serverTimestamp(),
      isoDate: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}
