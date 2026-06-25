'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    title: 'Travel Bangladesh, Seat by Seat',
    subtitle: 'Pick your exact seat on a live map. First to choose, first to ride.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80',
  },
  {
    title: 'Bus, Train, Launch & Flight',
    subtitle: 'One platform for every journey across the country.',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80',
  },
  {
    title: 'Reserve in Real Time',
    subtitle: 'Your seat is held for 5 minutes - pay securely with Stripe.',
    image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=1600&q=80',
  },
];

export function Hero() {
  return (
    <section id="hero-slider" className="relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[460px] w-full sm:h-[560px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container-page">
                  <div className="max-w-xl animate-fade-in">
                    <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">{s.title}</h1>
                    <p className="mt-4 text-lg text-slate-200">{s.subtitle}</p>
                    <Link
                      href="/tickets"
                      className="mt-7 inline-flex rounded-lg bg-brand-600 px-7 py-3 font-medium text-white hover:bg-brand-700"
                    >
                      Browse Tickets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
