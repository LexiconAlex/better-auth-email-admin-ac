import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  article: ["create", "read", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  article: ["read"],
});
export const admin = ac.newRole({
  article: ["read", "create", "delete"],
  ...adminAc.statements,
});
export const writer = ac.newRole({
  article: ["read", "create"],
});
