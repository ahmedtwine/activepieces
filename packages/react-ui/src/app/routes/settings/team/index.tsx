import { LoaderIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/seperator';
import { InvitationCard } from '@/features/team/component/invitation-card';
import { ProjectMemberCard } from '@/features/team/component/project-member-card';
import { projectMembersHooks } from '@/features/team/lib/project-members-hooks';
import { userInvitationsHooks } from '@/features/team/lib/user-invitations-hooks';
import { ProjectMemberWithUser } from '@activepieces/ee-shared';

import { InviteUserDialog } from '../../../../features/team/component/invite-user-dialog';

export default function TeamPage() {
  const { projectMembers, isLoading: projectMembersIsPending } =
    projectMembersHooks.useProjectMembers();
  const { invitations, isLoading: invitationsIsPending } =
    userInvitationsHooks.useInvitations();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
          <CardDescription>
            Invite your team members to collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 ">
          <div className="flex min-h-[35px] flex-col gap-4">
            {projectMembersIsPending && (
              <div className="flex justify-center animate-spin">
                <LoaderIcon></LoaderIcon>
              </div>
            )}
            {projectMembers && projectMembers.length === 0 && (
              <div className="text-center">
                No members are added to this project.
              </div>
            )}

            {Array.isArray(projectMembers) &&
              projectMembers.map((member: ProjectMemberWithUser) => (
                <ProjectMemberCard
                  key={member.id}
                  member={member}
                ></ProjectMemberCard>
              ))}
          </div>
          <Separator />
          <div className="text-2xl font-bold tracking-tight">
            Pending Invitations
          </div>
          <div className="flex min-h-[35px] flex-col gap-4">
            {invitationsIsPending && (
              <div className="flex justify-center animate-spin">
                <LoaderIcon></LoaderIcon>
              </div>
            )}
            {invitations && invitations.length === 0 && (
              <div className="text-center">No pending invitation.</div>
            )}
            {Array.isArray(invitations) &&
              invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                ></InvitationCard>
              ))}
          </div>
          <div className="mt-4 flex items-center  space-x-2">
            <div className="flex-grow">
              <InviteUserDialog></InviteUserDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
