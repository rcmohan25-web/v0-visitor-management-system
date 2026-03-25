'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Visitor } from '@/lib/types';
import { VisitorForm } from './VisitorForm';

interface VisitorTableProps {
  visitors: (Visitor & { id: string })[];
  onAdd: (visitor: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (id: string, visitor: Partial<Visitor>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onConvertToApplicant: (visitor: Visitor & { id: string }) => void;
  isLoading?: boolean;
}

export function VisitorTable({
  visitors,
  onAdd,
  onUpdate,
  onDelete,
  onConvertToApplicant,
  isLoading = false,
}: VisitorTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (data: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  const editingVisitor = visitors.find((v) => v.id === editingId);

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
        Add New Visitor
      </Button>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No visitors yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.email}</TableCell>
                  <TableCell>{visitor.phone}</TableCell>
                  <TableCell>{visitor.countryOfInterest}</TableCell>
                  <TableCell>{new Date(visitor.visitDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(visitor.id)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onConvertToApplicant(visitor)}
                        disabled={isLoading}
                      >
                        Convert
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(visitor.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Visitor</DialogTitle>
          </DialogHeader>
          <VisitorForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Visitor</DialogTitle>
          </DialogHeader>
          {editingVisitor && (
            <VisitorForm
              initialData={editingVisitor}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Visitor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this visitor? This action cannot be undone.
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
