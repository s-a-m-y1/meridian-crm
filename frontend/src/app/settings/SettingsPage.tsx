"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Loader2, Eye, EyeOff } from "lucide-react";

type Tab = "profile" | "organization" | "password";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "profile", label: "Profile" },
  { id: "organization", label: "Organization" },
  { id: "password", label: "Password" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              tab === t.id
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab />}
      {tab === "organization" && <OrganizationTab />}
      {tab === "password" && <PasswordTab />}
    </div>
  );
}

function ProfileTab() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile({ name: name.trim() });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input type="email" value={user?.email ?? ""} readOnly disabled className="bg-gray-100 dark:bg-gray-800 text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed{user?.emailVerifiedAt ? " • verified" : ""}</p>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function OrganizationTab() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getCurrentOrganization()
      .then((res) => {
        const org = res.data;
        setName(org?.name ?? "");
        setRole(org?.role ?? "");
        setOrgId(org?.id ?? "");
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Failed to load organization")))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Organization name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      await api.updateCurrentOrganization({ name: name.trim() });
      toast.success("Organization updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update organization"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <CardDescription>Workspace your account belongs to{role ? ` (role: ${role})` : ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization name</label>
            <Input name="organization" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization ID</label>
            <Input value={orgId} readOnly disabled className="bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono text-xs" />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      toast.success("Password changed — other sessions were signed out");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to change password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Changing your password signs you out of other sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current password</label>
            <Input name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
            <Input name="newPassword" type={show ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} maxLength={128} autoComplete="new-password" />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm new password</label>
            <Input name="confirmPassword" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
