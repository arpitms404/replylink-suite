import type { Role } from "./mock/data";

export type Action =
  | "launch_campaigns" | "delete_contacts" | "reply_inbox" | "manage_billing"
  | "invite_team" | "edit_api_config" | "view_inbox" | "create_template"
  | "edit_permissions" | "delete_campaign";

const matrix: Record<Action, Role[]> = {
  launch_campaigns: ["Super Admin", "Admin", "Marketing Manager"],
  delete_contacts: ["Super Admin", "Admin"],
  reply_inbox: ["Super Admin", "Admin", "Support Agent"],
  manage_billing: ["Super Admin"],
  invite_team: ["Super Admin", "Admin"],
  edit_api_config: ["Super Admin"],
  view_inbox: ["Super Admin", "Admin", "Marketing Manager", "Support Agent"],
  create_template: ["Super Admin", "Admin", "Marketing Manager"],
  edit_permissions: ["Super Admin"],
  delete_campaign: ["Super Admin", "Admin"],
};

export function canUserDo(role: Role, action: Action): boolean {
  return matrix[action]?.includes(role) ?? false;
}

export const permissionMatrix = matrix;
