export type UserRole = 'admin' | 'staff' | 'counsellor';

export interface Visitor {
  id?: string;
  name: string;
  email: string;
  phone: string;
  countryOfInterest: string;
  visitDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Applicant {
  id?: string;
  name: string;
  email: string;
  phone: string;
  countryOfInterest: string;
  visitorId?: string; // Reference to original visitor if converted
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'completed';
  intendedDegree: string;
  intendedField: string;
  testScores?: string;
  documents?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
