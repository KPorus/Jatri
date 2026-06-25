'use client';

import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div id="contact-page" className="container-page py-16">
      <h1 className="section-heading">Contact Us</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Have a question about your booking? Reach out and our team will get back to you.
          </p>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Mail className="text-brand-500" size={18} /> support@ticketcutter.com
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Phone className="text-brand-500" size={18} /> +880 1700-000000
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <MapPin className="text-brand-500" size={18} /> Dhaka, Bangladesh
          </div>
        </div>

        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success('Thanks! We will get back to you soon.');
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-4"
          >
            <Input id="contact-name" label="Name" placeholder="Your name" required />
            <Input id="contact-email" label="Email" type="email" placeholder="you@example.com" required />
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
