"use client";

import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { Roles } from "@/enums";
import {
  Search,
  ShieldCheck,
  Paintbrush,
  UserCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  surname: string | null;
  roleId: number;
  wallet: number;
  walletNaira: number;
  profilePicture: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
      });
      if (roleFilter !== "all") {
        params.set("roleId", roleFilter);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.users);
        setTotalCount(data.totalCount);
      }
    } catch {
      setMessage({ text: "Failed to fetch users", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, searchQuery, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    setUpdatingUserId(userId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId: newRoleId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({
          text: `Successfully updated user #${userId} role.`,
          type: "success",
        });
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u))
        );
      } else {
        setMessage({
          text: data.error || "Failed to update user role",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Network error updating user role",
        type: "error",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadge = (roleId: number) => {
    switch (roleId) {
      case Roles.Admin:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        );
      case Roles.Artist:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Paintbrush className="w-3 h-3" />
            Artist
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <UserCheck className="w-3 h-3" />
            Collector
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Access & RBAC Governance
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            User Directory & Roles
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Inspect collector and artist accounts, view balances, and update authorization roles{totalCount > 0 ? ` (${totalCount} total accounts)` : ""}.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-3 rounded-2xl border border-border-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Users" },
            { id: String(Roles.Collector), label: "Collectors" },
            { id: String(Roles.Artist), label: "Artists" },
            { id: String(Roles.Admin), label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setRoleFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search username, email, name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading user directory...</span>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-elevated/40 text-text-muted font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role Badge</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-text">
                            {user.username}
                          </div>
                          {(user.firstName || user.surname) && (
                            <div className="text-[11px] text-text-muted">
                              {[user.firstName, user.surname].filter(Boolean).join(" ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.roleId)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-text">
                      {formatCurrency(user.walletNaira)}
                    </td>
                    <td className="py-3 px-4 text-text-muted whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingUserId === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <select
                            value={user.roleId}
                            onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                            className="bg-surface-elevated border border-border-subtle rounded-lg px-2 py-1 text-xs text-text focus:outline-hidden focus:border-primary cursor-pointer"
                          >
                            <option value={Roles.Collector}>Collector</option>
                            <option value={Roles.Artist}>Artist</option>
                            <option value={Roles.Admin}>Admin</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
