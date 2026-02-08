'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import CategorySelector from './CategorySelector';
import PrioritySelector from './PrioritySelector';
import DatePicker from './DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TaskFormProps {
  onSubmit: (title: string, description: string, category?: string | null, priority?: string, dueDate?: Date | null) => Promise<void>;
  initialTitle?: string;
  initialDescription?: string;
  initialCategory?: string | null;
  initialPriority?: string | null;
  initialDueDate?: string | null;
  submitLabel?: string;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

interface FormData {
  title: string;
  description: string;
}

interface ValidationErrors {
  title?: string;
  description?: string;
}

export default function TaskForm({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialCategory = null,
  initialPriority = null,
  initialDueDate = null,
  submitLabel = 'Create Task',
  onCancel,
  mode = 'create',
}: TaskFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialTitle,
    description: initialDescription,
  });

  const [category, setCategory] = useState<string | null>(initialCategory);
  const [priority, setPriority] = useState<string>(initialPriority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    initialDueDate ? new Date(initialDueDate) : null
  );

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
    }
    if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData.title.trim(), formData.description.trim(), category, priority, dueDate);
      if (mode === 'create') {
        setFormData({ title: '', description: '' });
        setCategory(null);
        setPriority('medium');
        setDueDate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="border-primary/20 shadow-2xl w-full">
          <CardContent className="p-6 w-full">
            {/* Header with Close Button - FIXED POSITION */}
            <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-card pb-4">
              <div>
                <h2 className="text-2xl font-bold gradient-text">
                  {mode === 'create' ? 'Create New Task' : 'Edit Task'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === 'create' ? 'Define your next achievement' : 'Refine your task details'}
                </p>
              </div>
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onCancel}
                  className="rounded-full hover:bg-accent hover:text-foreground shrink-0"
                  aria-label="Close form"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Task Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What needs to be accomplished?"
                    disabled={loading}
                    className={cn(
                      "h-12 border-2 text-base w-full",
                      validationErrors.title && "border-destructive focus-visible:ring-destructive"
                    )}
                    autoFocus
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-destructive">{validationErrors.title}</p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details, context, or subtasks..."
                    rows={4}
                    disabled={loading}
                    className={cn(
                      "text-base w-full",
                      validationErrors.description && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-destructive">{validationErrors.description}</p>
                  )}
                </div>

                {/* FIXED: Priority and Category Selectors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Priority Level</Label>
                    <div className="w-full">
                      <PrioritySelector value={priority} onChange={setPriority} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Category</Label>
                    <div className="w-full">
                      <CategorySelector value={category} onChange={setCategory} />
                    </div>
                  </div>
                </div>

                {/* Date Picker - FIXED to show properly */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Due Date</Label>
                  <div className="w-full">
                    <DatePicker value={dueDate} onChange={setDueDate} />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-in">
                  {error}
                </div>
              )}

              {/* Submit Buttons - FIXED: Always visible at bottom */}
              <div className="flex gap-3 pt-6 border-t border-border/50 sticky bottom-0 bg-card pb-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 h-12 min-h-[3rem]"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "flex-1 h-12 min-h-[3rem] glow-effect text-base font-semibold",
                    mode === 'create' ? "bg-gradient-ai text-gray-900" : "bg-primary text-primary-foreground"
                  )}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    submitLabel
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}