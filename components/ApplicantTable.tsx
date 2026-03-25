'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Applicant } from '@/lib/types';
import { ApplicantForm } from './ApplicantForm';

interface ApplicantTableProps {
  applicants: (Applicant & { id: string })[];
  onAdd: (applicant: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (id: string, applicant: Partial<Applicant>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export function ApplicantTable({
  applicants,
  onAdd,
  onUpdate,
  onDelete,
  isLoading = false,
}: ApplicantTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilterId, setStatusFilterId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAdd = async (data: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingId) return;
    setIsSubmitting(true);
    try {
      await onUpdate(editingId, data);
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsSubmitting(true);
    try {
      await onUpdate(id, {
        applicationStatus: newStatus as 'pending' | 'approved' | 'rejected' | 'completed',
      });
      setStatusFilterId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editingApplicant = applicants.find((a) => a.id === editingId);
  const filteredApplicants =
    filterStatus === 'all'
      ? applicants
      : applicants.filter((a) => a.applicationStatus === filterStatus);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          Add New Applicant
        </Button>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by Status:</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  {filterStatus === 'all'
                    ? 'No applicants yet. Add one to get started.'
                    : `No ${filterStatus} applicants.`}
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.countryOfInterest}</TableCell>
                  <TableCell>{applicant.intendedDegree}</TableCell>
                  <TableCell>{applicant.intendedField}</TableCell>
                  <TableCell>
                    <Select
                      value={applicant.applicationStatus}
                      onValueChange={(value) => handleStatusChange(applicant.id, value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(applicant.id)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(applicant.id)}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Applicant</DialogTitle>
          </DialogHeader>
          <ApplicantForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Applicant</DialogTitle>
          </DialogHeader>
          {editingApplicant && (
            <ApplicantForm
              initialData={editingApplicant}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Applicant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this applicant? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
