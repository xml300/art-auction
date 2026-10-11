/**
 * Application-wide enumeration definitions.
 */

export enum Roles {
  Admin = 0,
  Artist = 1,
  Collector = 2,
}

export const RoleNames: Record<Roles, string> = {
  [Roles.Admin]: "Admin",
  [Roles.Artist]: "Artist",
  [Roles.Collector]: "Collector",
};
