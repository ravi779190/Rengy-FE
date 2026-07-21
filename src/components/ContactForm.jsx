import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const STATUS_OPTIONS = ['Lead', 'Prospect', 'Customer'];

export default function ContactForm({ initialValues, onSubmit, onCancel, submitLabel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'Lead',
      notes: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
      aria-label={submitLabel || 'Contact form'}
      noValidate
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-slate-600">
          Name
        </label>
        <input
          id="name"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-slate-600">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm text-slate-600">
            Phone
          </label>
          <input
            id="phone"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            {...register('phone')}
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1 block text-sm text-slate-600">
            Company
          </label>
          <input
            id="company"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            {...register('company')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm text-slate-600">
          Status
        </label>
        <select
          id="status"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          {...register('status')}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm text-slate-600">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          {...register('notes')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : submitLabel || 'Save'}
        </button>
      </div>
    </form>
  );
}
