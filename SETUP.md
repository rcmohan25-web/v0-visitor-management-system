# Visitor & Applicant Management System - Setup Guide

## Overview

This is a complete visitor and applicant management system for a study consultancy in Nepal. It allows admins, staff, and counsellors to:

- Add, edit, and delete visitor details
- Convert visitors to applicants
- Manage applicant profiles with degree and field information
- Track application status (pending, approved, rejected, completed)
- Filter applicants by status

## Prerequisites

- Node.js 18+ and pnpm
- Firebase project (free tier works)

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore database:
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select region (closest to your location)
4. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Under "Your apps", add a "Web" app
   - Copy the Firebase configuration

## Step 2: Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace these values with your actual Firebase credentials.

## Step 3: Install Dependencies

```bash
pnpm install
```

This automatically installs Firebase and all other dependencies.

## Step 4: Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Role Selection
- Select from Admin, Staff, or Counsellor roles
- Currently all roles have the same permissions (can be customized)

### Visitor Management
- **Add Visitor**: Click "Add New Visitor" to enter visitor details
  - Name, Email, Phone, Country of Interest, Visit Date, Notes
- **Edit**: Click "Edit" to modify visitor information
- **Delete**: Click "Delete" to remove a visitor
- **Convert**: Click "Convert" to convert a visitor to an applicant
  - Fill in additional details: Intended Degree, Field of Study
  - Visitor will be removed after conversion

### Applicant Management
- **Add Applicant**: Click "Add New Applicant" to create directly
  - Includes all visitor fields plus applicant-specific fields
- **Edit**: Update any applicant details
- **Delete**: Remove an applicant
- **Change Status**: Use the status dropdown to update application status
- **Filter**: Filter applicants by status (pending, approved, rejected, completed)

## Database Schema

### Visitors Collection
```
{
  id: string (auto-generated)
  name: string
  email: string
  phone: string
  countryOfInterest: string
  visitDate: string (ISO date)
  notes: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Applicants Collection
```
{
  id: string (auto-generated)
  name: string
  email: string
  phone: string
  countryOfInterest: string
  visitorId: string (optional - reference to original visitor)
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'completed'
  intendedDegree: string
  intendedField: string
  testScores: string (optional)
  documents: string (optional)
  notes: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Firestore Security Rules (for Production)

After testing, update your Firestore rules for security. Replace the default test mode rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // For now, allow authenticated users
    // Add proper authentication and RLS later
    match /visitors/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /applicants/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Customization

### Add More Status Options
Edit `lib/types.ts` and `components/ApplicantForm.tsx` and `components/ApplicantTable.tsx`

### Add Authentication
1. Enable Firebase Authentication
2. Use `@react-firebase/auth` or similar
3. Add JWT verification in backend (future enhancement)

### Customize Fields
Edit `lib/types.ts` to modify the Visitor and Applicant interfaces, then update the forms accordingly.

### Add More Roles
Edit `lib/types.ts` to add new roles, then configure permissions in the main dashboard.

## Troubleshooting

### Firebase Connection Issues
- Check `.env.local` has correct credentials
- Verify Firestore database is created and in test mode
- Check browser console for errors

### No Data Showing
- Click "Add New Visitor" or "Add New Applicant" to create test data
- Check Firestore console to see if data is being stored

### Form Validation Errors
- Ensure all required fields (marked with *) are filled
- Check browser console for specific error messages

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Role-based access control (RBAC)
- [ ] Document upload functionality
- [ ] Email notifications
- [ ] Export to Excel/PDF
- [ ] Advanced filtering and search
- [ ] Dashboard analytics and charts
- [ ] File storage for documents
- [ ] Email integration for applicant communications

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify Firebase configuration in `.env.local`
3. Check Firestore data structure matches schema above
