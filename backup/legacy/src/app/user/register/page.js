'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../RAZGlobals.css';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('entraz_token', data.token);
                localStorage.setItem('entraz_user', JSON.stringify(data.user));
                router.push('/');
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <div className="bg-[#1e293b] p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                    Join EntRAZ
                </h1>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-slate-400 mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-transform transform active:scale-95 shadow-lg shadow-indigo-500/30"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400">
                    Already have an account? <Link href="/user/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
                </div>
            </div>
        </div>
    );
}
