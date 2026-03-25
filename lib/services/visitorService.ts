import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Visitor } from '../types';

const VISITORS_COLLECTION = 'visitors';

export const visitorService = {
  async addVisitor(visitor: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, VISITORS_COLLECTION), {
        ...visitor,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return { id: docRef.id, ...visitor };
    } catch (error) {
      console.error('Error adding visitor:', error);
      throw error;
    }
  },

  async getVisitors() {
    try {
      const q = query(collection(db, VISITORS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Visitor & { id: string })[];
    } catch (error) {
      console.error('Error getting visitors:', error);
      throw error;
    }
  },

  async updateVisitor(id: string, updates: Partial<Visitor>) {
    try {
      const docRef = doc(db, VISITORS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating visitor:', error);
      throw error;
    }
  },

  async deleteVisitor(id: string) {
    try {
      await deleteDoc(doc(db, VISITORS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting visitor:', error);
      throw error;
    }
  },
};
