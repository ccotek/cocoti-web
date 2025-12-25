"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  DevicePhoneMobileIcon,
  UserGroupIcon,
  SparklesIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  EyeIcon,
  GlobeAltIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";
import { translate } from "@/utils/translations";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
} as const;

const stepIcons = [
  DevicePhoneMobileIcon,
  UserGroupIcon,
  TrophyIcon
];

const valueIcons: Record<number, any> = {
  0: BanknotesIcon,
  1: ShieldCheckIcon,
  2: EyeIcon,
  3: GlobeAltIcon
};

type WhySectionProps = {
  why: {
    title: string;
    subtitle: string;
    valuesSubtitle: string;
    values: Array<{
      title: string;
      description: string;
    }>;
  };
  how: {
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      quote: string;
      avatar: string;
    }>;
  };
  locale: 'fr' | 'en';
};

export default function WhySection({ why, how, testimonials, locale }: WhySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const items = Array.isArray(testimonials?.items) ? testimonials.items : [];

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [items.length]);

  // Progress line animation based on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const { scrollYProgress: stepsScrollProgress } = useScroll({
    target: stepsRef,
    offset: ["start 80%", "end 20%"]
  });

  const pathLength = useTransform(stepsScrollProgress, [0, 0.8], [0, 1]);

  return (
    <section className="section-padding bg-sand relative overflow-hidden" ref={containerRef}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cloud/50 to-transparent" />

      {/* Abstract background shapes for premium feel */}
      <div className="absolute top-1/4 left-[-10%] w-[40%] h-[40%] bg-magenta/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[40%] h-[40%] bg-sunset/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Header Section */}
        <motion.div
          id="how"
          className="max-w-3xl mb-16 lg:mb-24 scroll-mt-[100px]"
          {...fadeInUp}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-magenta/10 text-magenta text-xs font-bold uppercase tracking-widest mb-6">
            {translate("why.badge", locale)}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-night mb-6 leading-tight tracking-tight">
            {why.title}
          </h2>
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
            {why.subtitle}
          </p>
        </motion.div>

        {/* Part 1: How it Works (Process Flow) */}
        <div className="relative mb-16 lg:mb-24" ref={stepsRef}>
          {/* Connection Path (Desktop) */}
          <div className="hidden lg:block absolute top-[80px] left-[15%] right-[15%] h-[2px] bg-cloud/30">
            <motion.div
              className="h-full bg-gradient-to-r from-magenta to-sunset origin-left"
              style={{ scaleX: pathLength }}
            />
          </div>

          {/* Connection Path (Mobile) */}
          <div className="lg:hidden absolute top-[50px] bottom-[50px] left-[49px] w-[2px] bg-cloud/30">
            <motion.div
              className="w-full bg-gradient-to-b from-magenta to-sunset origin-top"
              style={{ scaleY: pathLength }}
            />
          </div>

          <div className="grid gap-20 lg:grid-cols-3 lg:gap-12 relative">
            {how.steps?.map((step, index) => {
              const Icon = stepIcons[index] || DevicePhoneMobileIcon;

              return (
                <motion.div
                  key={step.title}
                  className="relative group lg:text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-center lg:flex-col lg:items-center gap-6 lg:gap-8 mb-6 lg:mb-10">
                    <div className="relative">
                      {/* Step Indicator Dot (on path) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-magenta z-20 shadow-[0_0_10px_rgba(255,58,129,0.3)] transition-all duration-300 group-hover:scale-125" />

                      {/* Floating Card */}
                      <div className="relative z-10 h-24 w-24 lg:h-40 lg:w-40 rounded-[2.5rem] bg-white shadow-2xl shadow-night/[0.03] border border-cloud/40 flex items-center justify-center transition-all duration-500 group-hover:shadow-magenta/10 group-hover:-translate-y-3 group-hover:border-magenta/20">
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-magenta/[0.02] to-sunset/[0.02]" />
                        <Icon className="h-10 w-10 lg:h-16 lg:w-16 text-night transition-colors duration-500 group-hover:text-magenta" />

                        {/* Number Badge */}
                        <div className="absolute -top-3 -right-3 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-br from-magenta to-sunset text-white flex items-center justify-center text-sm lg:text-base font-bold shadow-lg shadow-magenta/20 transition-transform group-hover:scale-110">
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden">
                      <h3 className="text-xl font-bold text-night group-hover:text-magenta transition-colors">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <div className="ml-30 lg:ml-0 lg:max-w-[280px] mx-auto">
                    <h3 className="hidden lg:block text-2xl font-bold text-night mb-4 group-hover:text-magenta transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-base text-ink-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Values section removed to eliminate redundancy with carousel */}

        {/* Part 3: Testimonials Integration */}
        {items.length > 0 && (
          <div className="pb-8 lg:pb-12 border-t border-cloud/20 pt-12 lg:pt-16">
            <div id="temoignages" className="scroll-mt-40 grid gap-16 lg:gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
              <motion.div className="space-y-8" {...fadeInUp}>
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-night tracking-tight mb-6">
                    {testimonials.title}
                  </h2>
                  <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
                    {testimonials.subtitle}
                  </p>
                </div>

                <div className="flex gap-3">
                  {items.map((_, indicatorIndex) => (
                    <button
                      key={indicatorIndex}
                      type="button"
                      onClick={() => setIndex(indicatorIndex)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${indicatorIndex === index ? "w-10 bg-magenta" : "w-2.5 bg-cloud hover:bg-cloud-dark"
                        }`}
                      aria-label={`${translate("testimonials.view", locale)} ${indicatorIndex + 1}`}
                    />
                  ))}
                </div>
              </motion.div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={items[index].name}
                    className="group relative rounded-[2.5rem] border border-cloud/40 bg-white/60 p-10 md:p-12 shadow-2xl shadow-night/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-magenta/5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="absolute top-8 right-12 text-6xl text-magenta/10 font-serif pointer-events-none">
                      &ldquo;
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-magenta to-sunset border-2 border-white shadow-lg shrink-0">
                        {index === 0 && <ShieldCheckIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />}
                        {index === 1 && <UserGroupIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />}
                        {index === 2 && <EyeIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-night mb-1">{items[index]?.name}</p>
                        <p className="text-sm font-medium text-magenta">{items[index]?.role}</p>
                      </div>
                    </div>

                    <p className="text-lg md:text-xl text-night italic leading-relaxed relative z-10">
                      &ldquo;{items[index]?.quote}&rdquo;
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Background decorative blob for testimonials */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sunset/5 rounded-full blur-[80px] -z-10" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
