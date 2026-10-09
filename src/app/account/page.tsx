'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountNav from '@/components/account-nav';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/toast-context';
import { Shield, KeyRound, UserCheck, Save } from 'lucide-react';

export default function AccountPage() {
  const { user, setUser, isLoading } = useAuthStore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast('New passwords do not match.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: any = { name, phone };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        toast('Profile security records updated successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast(data.error || 'Failed to update profile.', 'error');
      }
    } catch {
      toast('An error occurred updating records.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-[#0B0B0C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[65vh] bg-[#0B0B0C] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-white mb-2">Private Client Area</h2>
        <p className="text-xs text-neutral-400 mb-6">Please authenticate to access your personal profile.</p>
        <Link href="/login" className="px-8 py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Profile & Security Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {/* Profile Information */}
              <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-lg text-white pb-3 border-b border-[#222226] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C9A24B]" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#18181E] border border-[#2A2A30] px-3.5 py-2.5 text-xs text-neutral-400 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Contact Telephone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (212) 555-0842"
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password / Passkey Update */}
              <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-lg text-white pb-3 border-b border-[#222226] flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#C9A24B]" />
                  Change Password / Security Passkey
                </h3>

                <p className="text-xs text-neutral-400 font-light">
                  Leave these fields blank if you do not wish to modify your current credentials.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Required only when changing password"
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Preserving Updates...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
