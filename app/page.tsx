'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Visitor, Applicant, UserRole } from '@/lib/types';
import { visitorService } from '@/lib/services/visitorService';
import { applicantService } from '@/lib/services/applicantService';
import { VisitorTable } from '@/components/VisitorTable';
import { ApplicantTable } from '@/components/ApplicantTable';
import { ConvertVisitorDialog } from '@/components/ConvertVisitorDialog';

export default function Dashboard() {
  const [visitors, setVisitors] = useState<(Visitor & { id: string })[]>([]);
  const [applicants, setApplicants] = useState<(Applicant & { id: string })[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorToConvert, setVisitorToConvert] = useState<(Visitor & { id: string }) | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [visitorsData, applicantsData] = await Promise.all([
        visitorService.getVisitors(),
        applicantService.getApplicants(),
      ]);
      setVisitors(visitorsData);
      setApplicants(applicantsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please check your Firebase configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVisitor = async (visitor: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await visitorService.addVisitor(visitor);
      await loadData();
    } catch (error) {
      console.error('Error adding visitor:', error);
      throw error;
    }
  };

  const handleUpdateVisitor = async (
    id: string,
    updates: Partial<Visitor>
  ) => {
    try {
      await visitorService.updateVisitor(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating visitor:', error);
      throw error;
    }
  };

  const handleDeleteVisitor = async (id: string) => {
    try {
      await visitorService.deleteVisitor(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting visitor:', error);
      throw error;
    }
  };

  const handleAddApplicant = async (
    applicant: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await applicantService.addApplicant(applicant);
      await loadData();
    } catch (error) {
      console.error('Error adding applicant:', error);
      throw error;
    }
  };

  const handleUpdateApplicant = async (
    id: string,
    updates: Partial<Applicant>
  ) => {
    try {
      await applicantService.updateApplicant(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating applicant:', error);
      throw error;
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    try {
      await applicantService.deleteApplicant(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting applicant:', error);
      throw error;
    }
  };

  const handleConvertToApplicant = (visitor: Visitor & { id: string }) => {
    setVisitorToConvert(visitor);
  };

  const handleCompleteConversion = async (
    applicantData: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      // Add applicant
      await applicantService.addApplicant(applicantData);
      // Delete visitor
      if (visitorToConvert?.id) {
        await visitorService.deleteVisitor(visitorToConvert.id);
      }
      await loadData();
      setVisitorToConvert(null);
    } catch (error) {
      console.error('Error converting visitor:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Visitor & Applicant Management
          </h1>
          <p className="text-slate-600">
            Manage visitor details and track applicants for abroad studies
          </p>
        </div>

        {/* Role Selector Card */}
        <Card className="mb-8 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">User Role</CardTitle>
            <CardDescription>
              Select your role to manage access (Demo: All roles have full access)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <label className="font-medium text-slate-700">Current Role:</label>
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <Tabs defaultValue="visitors" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-slate-50 p-0">
              <TabsTrigger
                value="visitors"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white"
              >
                Visitors ({visitors.length})
              </TabsTrigger>
              <TabsTrigger
                value="applicants"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white"
              >
                Applicants ({applicants.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visitors" className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Visitor Management</h2>
                  <p className="text-slate-600 mb-4">
                    Add, edit, delete, or convert visitors to applicants
                  </p>
                </div>
                <VisitorTable
                  visitors={visitors}
                  onAdd={handleAddVisitor}
                  onUpdate={handleUpdateVisitor}
                  onDelete={handleDeleteVisitor}
                  onConvertToApplicant={handleConvertToApplicant}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="applicants" className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Applicant Management</h2>
                  <p className="text-slate-600 mb-4">
                    Track and manage applicants for abroad studies
                  </p>
                </div>
                <ApplicantTable
                  applicants={applicants}
                  onAdd={handleAddApplicant}
                  onUpdate={handleUpdateApplicant}
                  onDelete={handleDeleteApplicant}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Convert Visitor Dialog */}
      {visitorToConvert && (
        <ConvertVisitorDialog
          visitor={visitorToConvert}
          onConvert={handleCompleteConversion}
          onCancel={() => setVisitorToConvert(null)}
        />
      )}
    </div>
  );
}
