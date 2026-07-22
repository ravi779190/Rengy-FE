const STATUS_STYLES = {
  Lead: 'bg-amber-100 text-amber-800',
  Prospect: 'bg-blue-100 text-blue-800',
  Customer: 'bg-green-100 text-green-800',
};

export default function ContactTable({ contacts, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">No contacts found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] table-fixed divide-y divide-slate-200 text-sm">
        <colgroup>
          <col className="w-[18%]" />
          <col className="w-[26%]" />
          <col className="w-[14%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Email</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Phone</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Company</th>
            <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td className="truncate px-4 py-2">{contact.name}</td>
              <td className="truncate px-4 py-2">{contact.email}</td>
              <td className="truncate px-4 py-2">{contact.phone || '—'}</td>
              <td className="truncate px-4 py-2">{contact.company || '—'}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[contact.status] || ''}`}
                >
                  {contact.status}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onEdit(contact)}
                  className="mr-2 text-slate-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(contact)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
