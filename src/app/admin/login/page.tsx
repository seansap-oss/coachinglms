'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage(){
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Check stored admin password from site settings
    try {
      const raw = localStorage.getItem('manikunj-store-v4');
      if(raw){
        const parsed = JSON.parse(raw);
        const pwd = parsed?.state?.siteSettings?.adminPassword || 'admin';
        if(password !== pwd){
          setLoading(false);
          setError('Wrong password');
          return;
        }
      } else {
        if(password !== 'admin'){
          setLoading(false);
          setError('Wrong password');
          return;
        }
      }
      // Also check username
      if(username !== 'admin'){
        setLoading(false);
        setError('Wrong username');
        return;
      }
      localStorage.setItem('mk_admin_loggedin', 'true');
      setLoading(false);
      router.push('/admin');
      router.refresh();
    } catch(e){
      setLoading(false);
      setError('Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#111111]'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <div className='text-center mb-6'>
          <div className='w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-3'><span className='font-black text-2xl'>MK</span></div>
          <h1 className='font-black text-2xl' style={{ fontFamily: 'var(--font-space-grotesk)' }}>ManiKunj Admin</h1>
          <p className='text-sm text-neutral-500'>Sign in to your CMS</p>
        </div>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='text-xs font-bold'>USERNAME</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className='w-full border border-neutral-300 px-3 py-2 text-sm mt-1' />
          </div>
          <div>
            <label className='text-xs font-bold'>PASSWORD</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} className='w-full border border-neutral-300 px-3 py-2 text-sm mt-1' />
          </div>
          {error && <p className='text-red-600 text-xs font-bold'>{error}</p>}
          <button type='submit' disabled={loading} className='w-full bg-black text-white px-6 py-3 text-sm font-black tracking-widest hover:bg-neutral-800 transition disabled:opacity-50'>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
