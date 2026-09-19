import Link from "next/link";
import { MapPin } from "lucide-react";
import Hero from "@/components/Hero";
import WatchViewerSection from "@/components/WatchViewerSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WatchViewerSection />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />

      <section className="container-x mt-32">
        <div className="glass glass-gold flex flex-col items-start justify-between gap-8 rounded-3xl p-8 sm:p-14 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Try them on in Nişantaşı</h2>
            <p className="mt-4 max-w-xl text-mist">
              Our boutique is open six days a week. Book a private fitting and a watchmaker will size the strap while
              you have tea.
            </p>
          </div>
          <Link href="/contact" className="btn btn-gold">
            <MapPin size={16} /> Book a fitting
          </Link>
        </div>
      </section>
    </>
  );
}
