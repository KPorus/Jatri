'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function SearchBar() {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [type, setType] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (type) params.set('type', type);
    router.push(`/tickets?${params.toString()}`);
  };

  return (
    <form
      id="home-search-bar"
      onSubmit={submit}
      className="container-page relative z-10 -mt-12 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <Input id="search-from" label="From" placeholder="e.g. Dhaka" value={from} onChange={(e) => setFrom(e.target.value)} />
      <Input id="search-to" label="To" placeholder="e.g. Sylhet" value={to} onChange={(e) => setTo(e.target.value)} />
      <Select id="search-type" label="Transport" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All types</option>
        <option value="bus">Bus</option>
        <option value="train">Train</option>
        <option value="launch">Launch</option>
        <option value="plane">Plane</option>
      </Select>
      <div className="flex items-end">
        <Button id="search-submit" type="submit" className="w-full">
          <Search size={16} /> Search
        </Button>
      </div>
    </form>
  );
}
