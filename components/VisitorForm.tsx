'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Visitor } from '@/lib/types';

interface VisitorFormProps {
  initialData?: Visitor;
  onSubmit: (data: Omit<Visitor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VisitorForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: VisitorFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    countryOfInterest: initialData?.countryOfInterest || '',
    visitDate: initialData?.visitDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.countryOfInterest) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <FieldGroup>
        <FieldLabel htmlFor="name">Name *</FieldLabel>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter visitor name"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="email">Email *</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="phone">Phone *</FieldLabel>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="countryOfInterest">Country of Interest *</FieldLabel>
        <Input
          id="countryOfInterest"
          name="countryOfInterest"
          value={formData.countryOfInterest}
          onChange={handleChange}
          placeholder="e.g., USA, Canada, UK"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="visitDate">Visit Date *</FieldLabel>
        <Input
          id="visitDate"
          name="visitDate"
          type="date"
          value={formData.visitDate}
          onChange={handleChange}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="notes">Notes</FieldLabel>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes (optional)"
          rows={4}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Visitor'}
        </Button>
      </div>
    </form>
  );
}
