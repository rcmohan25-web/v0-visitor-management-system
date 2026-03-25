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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Visitor, Applicant } from '@/lib/types';

interface ConvertVisitorDialogProps {
  visitor: Visitor & { id: string };
  onConvert: (applicant: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export function ConvertVisitorDialog({
  visitor,
  onConvert,
  onCancel,
}: ConvertVisitorDialogProps) {
  const [formData, setFormData] = useState({
    name: visitor.name,
    email: visitor.email,
    phone: visitor.phone,
    countryOfInterest: visitor.countryOfInterest,
    intendedDegree: '',
    intendedField: '',
    applicationStatus: 'pending' as const,
    testScores: '',
    documents: '',
    notes: visitor.notes || '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDegreeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, intendedDegree: value }));
  };

  const handleFieldChange = (value: string) => {
    setFormData((prev) => ({ ...prev, intendedField: value }));
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

    if (!formData.intendedDegree || !formData.intendedField) {
      setError('Please fill in the intended degree and field of study');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConvert({
        ...formData,
        visitorId: visitor.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert Visitor to Applicant</DialogTitle>
          <DialogDescription>
            Moving {visitor.name} from visitor to applicant. Fill in the additional applicant details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          {/* Pre-filled fields from visitor */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-slate-900">Visitor Information (Pre-filled)</h3>

            <FieldGroup>
              <FieldLabel>Name</FieldLabel>
              <Input value={visitor.name} disabled className="bg-white" />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <Input value={visitor.email} disabled className="bg-white" />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Phone</FieldLabel>
              <Input value={visitor.phone} disabled className="bg-white" />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Country of Interest</FieldLabel>
              <Input value={visitor.countryOfInterest} disabled className="bg-white" />
            </FieldGroup>
          </div>

          {/* Additional applicant fields */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-slate-900">Applicant Information (Required)</h3>

            <FieldGroup>
              <FieldLabel htmlFor="intendedDegree">Intended Degree *</FieldLabel>
              <Select value={formData.intendedDegree} onValueChange={handleDegreeChange}>
                <SelectTrigger id="intendedDegree">
                  <SelectValue placeholder="Select degree level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                  <SelectItem value="Master's">Master's</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="intendedField">Field of Study *</FieldLabel>
              <Select value={formData.intendedField} onValueChange={handleFieldChange}>
                <SelectTrigger id="intendedField">
                  <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                  <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="applicationStatus">Application Status</FieldLabel>
              <Select value={formData.applicationStatus} onValueChange={handleStatusChange}>
                <SelectTrigger id="applicationStatus">
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
              <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes"
                rows={3}
              />
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Converting...' : 'Convert to Applicant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
