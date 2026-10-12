import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const ContactPage: React.FC = () => {
  const { settings } = useRestaurant();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#991b1b] bg-red-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
            Find Us & Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mt-2 mb-3">
            Get In Touch
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Have an inquiry about table availability, special party orders, or your online delivery? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Contact Info */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Restaurant Details
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-[#991b1b] rounded-2xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1">Physical Location</h4>
                  {settings.address ? (
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {settings.address}, {settings.city} {settings.pincode}
                    </p>
                  ) : (
                    <p className="text-stone-400 text-xs italic">
                      [Official physical address pending owner entry in Admin Settings]
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-[#991b1b] rounded-2xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1">Operating Hours</h4>
                  <p className="text-stone-600 text-xs sm:text-sm">
                    {settings.operating_hours}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium inline-block mt-0.5">
                    Open Everyday for Dining, Takeaway & Home Delivery
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-[#991b1b] rounded-2xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1">Phone Inquiries</h4>
                  {settings.phone ? (
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-stone-900 hover:text-[#991b1b] text-sm font-semibold block"
                    >
                      {settings.phone}
                    </a>
                  ) : (
                    <p className="text-stone-400 text-xs italic">
                      [Phone number pending owner configuration]
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-[#991b1b] rounded-2xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm mb-1">Email Support</h4>
                  {settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-stone-900 hover:text-[#991b1b] text-sm font-semibold block"
                    >
                      {settings.email}
                    </a>
                  ) : (
                    <p className="text-stone-400 text-xs italic">
                      [Email pending owner configuration]
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mb-6">
              Leave your feedback or inquiry and our team will get back to you promptly.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message or Special Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you'd like to ask..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
