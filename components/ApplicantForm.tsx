'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Applicant } from '@/lib/types';

interface ApplicantFormProps {
  initialData?: Applicant;
  onSubmit: (data: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicantForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApplicantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    countryOfInterest: initialData?.countryOfInterest || '',
    intendedDegree: initialData?.intendedDegree || '',
    intendedField: initialData?.intendedField || '',
    applicationStatus: initialData?.applicationStatus || 'pending' as const,
    testScores: initialData?.testScores || '',
    documents: initialData?.documents || '',
    notes: initialData?.notes || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      applicationStatus: value as 'pending' | 'approved' | 'rejected' | 'completed',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.countryOfInterest ||
      !formData.intendedDegree ||
      !formData.intendedField
    ) {
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
          placeholder="Enter applicant name"
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
        <FieldLabel htmlFor="intendedDegree">Intended Degree *</FieldLabel>
        <Input
          id="intendedDegree"
          name="intendedDegree"
          value={formData.intendedDegree}
          onChange={handleChange}
          placeholder="e.g., Bachelor's, Master's, PhD"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="intendedField">Intended Field of Study *</FieldLabel>
        <Input
          id="intendedField"
          name="intendedField"
          value={formData.intendedField}
          onChange={handleChange}
          placeholder="e.g., Computer Science, Business"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="status">Application Status *</FieldLabel>
        <Select value={formData.applicationStatus} onValueChange={handleStatusChange}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="testScores">Test Scores</FieldLabel>
        <Input
          id="testScores"
          name="testScores"
          value={formData.testScores}
          onChange={handleChange}
          placeholder="e.g., IELTS: 7.5, GMAT: 650"
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="documents">Documents</FieldLabel>
        <Input
          id="documents"
          name="documents"
          value={formData.documents}
          onChange={handleChange}
          placeholder="List of submitted documents"
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
          {isLoading ? 'Saving...' : 'Save Applicant'}
        </Button>
      </div>
    </form>
  );
}
