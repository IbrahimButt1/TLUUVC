import { getSiteSettings } from "@/lib/site-settings";
import { getServices } from "@/lib/services";
import { getTestimonials } from "@/lib/testimonials";
import { getHeroImages } from "@/lib/hero-images";
import { getUnreadEmailCount } from "@/lib/emails";
import { getManifestEntries } from "@/lib/manifest";
import DashboardClient from "@/components/admin/dashboard-client";

export default async function AdminDashboard() {
  const settings = await getSiteSettings();
  const services = await getServices();
  const testimonials = await getTestimonials();
  const heroImages = await getHeroImages();
  const unreadCount = await getUnreadEmailCount();
  const manifestEntries = await getManifestEntries();

  const totals = manifestEntries.reduce((acc, entry) => {
    if (entry.type === 'debit') {
      acc.debit += entry.amount;
    } else {
      acc.credit += entry.amount;
    }
    return acc;
  }, { debit: 0, credit: 0 });

  const balance = totals.credit - totals.debit;
  const lastEntry = manifestEntries.length > 0 ? manifestEntries[0] : null;

  const stats = [
    { title: "Total Services", value: services.length, href: "/admin/services" },
    { title: "Total Testimonials", value: testimonials.length, href: "/admin/testimonials" },
    { title: "Total Hero Images", value: heroImages.length, href: "/admin/hero" },
    { title: "Unread Messages", value: unreadCount, href: "/admin/inbox" },
  ];

  const financialStats = [
      { title: "Total Credit", value: `$${totals.credit.toFixed(2)}`, href: "/admin/manifest", className: "text-green-600" },
      { title: "Total Debit", value: `$${totals.debit.toFixed(2)}`, href: "/admin/manifest", className: "text-red-600" },
      { title: "Net Balance", value: `$${balance.toFixed(2)}`, href: "/admin/manifest", className: balance >= 0 ? 'text-green-600' : 'text-red-600'},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <DashboardClient 
        settings={settings} 
        stats={stats} 
        financialStats={financialStats}
        lastManifestEntry={lastEntry}
       />
    </div>
  );
}
