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
import { Applicant } from '../types';

const APPLICANTS_COLLECTION = 'applicants';

export const applicantService = {
  async addApplicant(applicant: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, APPLICANTS_COLLECTION), {
        ...applicant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return { id: docRef.id, ...applicant };
    } catch (error) {
      console.error('Error adding applicant:', error);
      throw error;
    }
  },

  async getApplicants() {
    try {
      const q = query(collection(db, APPLICANTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Applicant & { id: string })[];
    } catch (error) {
      console.error('Error getting applicants:', error);
      throw error;
    }
  },

  async updateApplicant(id: string, updates: Partial<Applicant>) {
    try {
      const docRef = doc(db, APPLICANTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating applicant:', error);
      throw error;
    }
  },

  async deleteApplicant(id: string) {
    try {
      await deleteDoc(doc(db, APPLICANTS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting applicant:', error);
      throw error;
    }
  },
};
