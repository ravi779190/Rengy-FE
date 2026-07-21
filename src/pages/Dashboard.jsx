import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import ContactTable from '../components/ContactTable';
import ContactForm from '../components/ContactForm';
import Pagination from '../components/Pagination';
import { ContactsTableSkeleton } from '../components/Skeleton';

const STATUS_OPTIONS = ['', 'Lead', 'Prospect', 'Customer'];
const LIMIT = 10;

const SEARCH_DEBOUNCE_MS = 400;

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'create' | contact object | null
  const [modalError, setModalError] = useState('');

  function extractErrorMessage(err) {
    const data = err.response?.data;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.message || e).join(' ');
    }
    return data?.message || 'Something went wrong. Please try again.';
  }

  function openModal(value) {
    setModalError('');
    setModal(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await api.get('/api/contacts', { params });
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function handleCreate(values) {
    setModalError('');
    try {
      await api.post('/api/contacts', values);
      setModal(null);
      setPage(1);
      fetchContacts();
    } catch (err) {
      setModalError(extractErrorMessage(err));
    }
  }

  async function handleUpdate(id, values) {
    setModalError('');
    try {
      await api.put(`/api/contacts/${id}`, values);
      setModal(null);
      fetchContacts();
    } catch (err) {
      setModalError(extractErrorMessage(err));
    }
  }

  async function handleDelete(contact) {
    if (!window.confirm(`Delete ${contact.name}?`)) return;
    setError('');
    try {
      await api.delete(`/api/contacts/${contact._id}`);
      fetchContacts();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleExport() {
    const res = await api.get('/api/contacts/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-800">Contacts</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Export CSV
          </button>
          <button
            onClick={() => openModal('create')}
            className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add Contact
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s || 'all'} value={s}>
              {s || 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <ContactsTableSkeleton rows={LIMIT} />
      ) : (
        <>
          <ContactTable contacts={contacts} onEdit={openModal} onDelete={handleDelete} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              {modal === 'create' ? 'Add Contact' : 'Edit Contact'}
            </h2>
            {modalError && (
              <p role="alert" className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
                {modalError}
              </p>
            )}
            <ContactForm
              initialValues={modal !== 'create' ? modal : undefined}
              submitLabel={modal === 'create' ? 'Add Contact' : 'Save Changes'}
              onCancel={() => setModal(null)}
              onSubmit={(values) =>
                modal === 'create' ? handleCreate(values) : handleUpdate(modal._id, values)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
