import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Field, inputCls } from "@/components/register/Stepper";
import { toast } from "sonner";
import { User, Shield, KeyRound, Save } from "lucide-react";

interface UserAuth {
  id: number;
  name: string;
  email: string;
  phone?: string;
  account_type: string;
}

export default function Profile() {
  const { auth } = usePage<{ auth: { user: UserAuth } }>().props;
  const user = auth.user;

  // Profile Form
  const profileForm = useForm({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  // Password Form
  const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.patch("/dashboard/profile", {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: () => toast.error("Failed to update profile details"),
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put("/dashboard/profile/password", {
      onSuccess: () => {
        toast.success("Password updated successfully");
        passwordForm.reset();
      },
      onError: () => toast.error("Failed to update password"),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Account Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-surface ring-1 ring-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <User className="size-5 text-primary" />
          <h2 className="text-base font-medium">Personal Information</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input
                className={inputCls}
                value={profileForm.data.name}
                onChange={(e) => profileForm.setData("name", e.target.value)}
              />
              {profileForm.errors.name && (
                <span className="text-xs text-destructive">{profileForm.errors.name}</span>
              )}
            </Field>

            <Field label="Account Type">
              <input
                className={`${inputCls} opacity-60 capitalize cursor-not-allowed`}
                value={user.account_type || "Member"}
                disabled
              />
            </Field>

            <Field label="Email Address" required>
              <input
                type="email"
                className={inputCls}
                value={profileForm.data.email}
                onChange={(e) => profileForm.setData("email", e.target.value)}
              />
              {profileForm.errors.email && (
                <span className="text-xs text-destructive">{profileForm.errors.email}</span>
              )}
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                className={inputCls}
                value={profileForm.data.phone}
                onChange={(e) => profileForm.setData("phone", e.target.value)}
              />
              {profileForm.errors.phone && (
                <span className="text-xs text-destructive">{profileForm.errors.phone}</span>
              )}
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileForm.processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Save className="size-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-surface ring-1 ring-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <KeyRound className="size-5 text-primary" />
          <h2 className="text-base font-medium">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Current Password" required>
              <input
                type="password"
                className={inputCls}
                value={passwordForm.data.current_password}
                onChange={(e) => passwordForm.setData("current_password", e.target.value)}
              />
              {passwordForm.errors.current_password && (
                <span className="text-xs text-destructive">{passwordForm.errors.current_password}</span>
              )}
            </Field>

            <Field label="New Password" required>
              <input
                type="password"
                className={inputCls}
                value={passwordForm.data.password}
                onChange={(e) => passwordForm.setData("password", e.target.value)}
              />
              {passwordForm.errors.password && (
                <span className="text-xs text-destructive">{passwordForm.errors.password}</span>
              )}
            </Field>

            <Field label="Confirm New Password" required>
              <input
                type="password"
                className={inputCls}
                value={passwordForm.data.password_confirmation}
                onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordForm.processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Shield className="size-4" /> Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Profile.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
