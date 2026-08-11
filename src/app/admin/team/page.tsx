import { prisma } from '../../../lib/prisma';
import TeamManager from './TeamManager';
import { requireAdmin } from '../../../lib/auth-check';

export const dynamic = 'force-dynamic';

export default async function AdminTeam() {
  const currentAdmin = await requireAdmin();
  const teamMembers = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Team Management</h1>
        <p className="mt-2 font-body text-cream-200/70">Manage admins who have access to this portal.</p>
      </div>

      <TeamManager initialMembers={teamMembers} currentUserEmail={currentAdmin.email} />
    </div>
  );
}
