import { getSiteSettings } from "@/lib/site-settings";
import { getServices } from "@/lib/services";
import { getTestimonials } from "@/lib/testimonials";
import { getHeroImages } from "@/lib/hero-images";
import { getUnreadEmailCount } from "@/lib/emails";
import DashboardClient from "@/components/admin/dashboard-client";

export default async function AdminDashboard() {
  const settings = await getSiteSettings();
  const services = await getServices();
  const testimonials = await getTestimonials();
  const heroImages = await getHeroImages();
  const unreadCount = await getUnreadEmailCount();

  const stats = [
    { title: "Total Services", value: services.length, href: "/admin/services" },
    { title: "Total Testimonials", value: testimonials.length, href: "/admin/testimonials" },
    { title: "Total Hero Images", value: heroImages.length, href: "/admin/hero" },
    { title: "Unread Messages", value: unreadCount, href: "/admin/inbox" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <DashboardClient settings={settings} stats={stats} />
    </div>
  );
}
