'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../../RAZGlobals.css';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // API call logic here
        alert('Feature coming soon: Update Password API');
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <nav className="raz-navbar">
                <Link href="/" className="raz-nav-logo">EntRAZ</Link>
                <div className="raz-nav-links">
                    <Link href="/user/profile" className="raz-nav-link">Back to Profile</Link>
                </div>
            </nav>

            <div className="pt-24 px-8 max-w-[600px] mx-auto">
                <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Change Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
