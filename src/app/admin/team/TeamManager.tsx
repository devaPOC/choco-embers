'use client';

import { useState } from 'react';
import { addTeamMember, removeTeamMember } from '../../actions/team';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type Admin = {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  createdAt: Date;
};

export default function TeamManager({ initialMembers, currentUserEmail }: { initialMembers: Admin[], currentUserEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('email', email);

    const res = await addTeamMember(formData);
    
    if (res.success) {
      setEmail('');
      window.location.reload();
    } else {
      setError(res.error || 'Failed to add member');
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    setLoading(true);
    await removeTeamMember(id);
    window.location.reload();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Add New Member */}
      <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md h-fit">
        <h2 className="mb-6 font-display text-xl font-semibold text-cream-100">Add Team Member</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-gold-200">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gold-200/20 bg-choco-500 p-3 text-cream-100 placeholder-cream-200/50 focus:border-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-300"
              placeholder="admin@chocoember.com"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 px-6 py-3 font-label text-sm font-bold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-300 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            Add Member
          </button>
        </form>
      </div>

      {/* Team Members List */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <h2 className="mb-6 font-display text-xl font-semibold text-cream-100">Current Members</h2>
          
          <div className="space-y-4">
            {initialMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-gold-200/10 bg-choco-500 p-4"
              >
                <div>
                  <h3 className="font-label text-sm uppercase tracking-wider text-cream-100">
                    {member.email}
                  </h3>
                  <p className="text-xs text-cream-200/70 mt-1">
                    Added {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {!member.isSuperAdmin && member.email !== currentUserEmail && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    disabled={loading}
                    className="rounded-lg p-2 text-cream-200 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            {initialMembers.length === 0 && (
              <div className="text-center py-8 text-cream-200/70">
                No team members found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
