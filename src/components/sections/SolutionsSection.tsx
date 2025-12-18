"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  HeartIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

const solutionIcons: Record<string, any> = {
  tontines: UsersIcon,
  cagnottes: HeartIcon,
  crowdfunding: SparklesIcon,
  "group-buys": ShoppingBagIcon,
  "installments": CreditCardIcon
};

const CYCLE_DURATION = 8000; // 8 seconds per solution

type SolutionsSectionProps = {
  solutions: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
};

export default function SolutionsSection({ solutions }: SolutionsSectionProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Initialize activeId if projects are available
  useEffect(() => {
    if (solutions.items?.length > 0 && !activeId) {
      setActiveId(solutions.items[0].id);
    }
  }, [solutions.items, activeId]);

  // Handle auto-scroll on mobile when activeId changes
  useEffect(() => {
    if (activeId && itemRefs.current[activeId] && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const element = itemRefs.current[activeId];

      // Only scroll if the element is not fully visible horizontally
      const containerRect = container.getBoundingClientRect();
      const elementRect = element!.getBoundingClientRect();

      if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
        element!.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeId]);

  useEffect(() => {
    if (!solutions.items?.length) return;

    const startTimer = () => {
      startTimeRef.current = Date.now();
      setProgress(0);

      const updateProgress = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const currentProgress = Math.min((elapsed / CYCLE_DURATION) * 100, 100);
        setProgress(currentProgress);

        if (currentProgress < 100) {
          timerRef.current = requestAnimationFrame(updateProgress) as any;
        } else {
          // Move to next item
          setActiveId(currentId => {
            const currentIndex = solutions.items.findIndex(item => item.id === currentId);
            const nextIndex = (currentIndex + 1) % solutions.items.length;
            return solutions.items[nextIndex].id;
          });
          startTimer();
        }
      };

      timerRef.current = requestAnimationFrame(updateProgress) as any;
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        if (typeof timerRef.current === "number") {
          cancelAnimationFrame(timerRef.current);
        } else {
          clearTimeout(timerRef.current);
        }
      }
    };
  }, [solutions.items, activeId]);

  const handleManualSelect = (id: string) => {
    setActiveId(id);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const activeSolution = solutions.items?.find(item => item.id === activeId) || solutions.items?.[0];
  const ActiveIcon = activeSolution ? solutionIcons[activeSolution.id] || SparklesIcon : SparklesIcon;

  return (
    <section id="solutions" className="section-padding bg-sunset/[0.02] overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-12 lg:mb-16 text-center lg:text-left mx-auto lg:mx-0"
        >
          <h2 className="text-3xl md:text-5xl font-black text-night mb-6 leading-tight">
            {solutions.title}
          </h2>
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {solutions.subtitle}
          </p>
        </motion.div>

        {/* Mobile: Horizontal Tabs | Desktop: Vertical Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* List/Tabs Container */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div
              ref={tabsContainerRef}
              className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory lg:snap-none"
            >
              {solutions.items?.map((item) => {
                const Icon = solutionIcons[item.id] || SparklesIcon;
                const isActive = activeId === item.id;

                return (
                  <button
                    key={item.id}
                    ref={el => { itemRefs.current[item.id] = el; }}
                    onClick={() => handleManualSelect(item.id)}
                    className={`group relative flex-none lg:flex-1 text-left p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden snap-center min-w-[200px] lg:min-w-0 ${isActive
                      ? "border-magenta bg-white shadow-xl shadow-magenta/5 lg:translate-x-4"
                      : "border-transparent bg-transparent hover:bg-white lg:hover:border-sunset/10 lg:hover:translate-x-2"
                      }`}
                  >
                    <div className="flex items-center gap-4 lg:gap-5 relative z-10">
                      <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-300 ${isActive
                        ? "bg-gradient-to-br from-magenta to-sunset text-white shadow-lg shadow-magenta/20"
                        : "bg-sunset/[0.05] text-night/60 group-hover:bg-magenta/10 group-hover:text-magenta"
                        }`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <span className={`text-sm lg:text-xl font-black transition-colors ${isActive ? "text-night" : "text-night/40 group-hover:text-night"
                        }`}>
                        {item.title}
                      </span>
                    </div>

                    {/* Progress Bar (at the bottom) */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 h-1 lg:h-1.5 bg-sunset/[0.05] w-full z-10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-magenta to-sunset"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: "linear" }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 w-full min-h-[400px] lg:min-h-0 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="lg:absolute lg:inset-0 bg-white rounded-[2.5rem] p-8 lg:p-16 border border-sunset/5 shadow-2xl shadow-sunset/[0.02] overflow-hidden group min-h-[400px] flex flex-col justify-center"
              >
                {/* Background Icon Detail */}
                <div className="absolute -top-16 -right-16 opacity-[0.03] transition-transform duration-1000 group-hover:scale-105 pointer-events-none z-0">
                  <ActiveIcon className="w-[300px] lg:w-[500px] h-[300px] lg:h-[500px]" />
                </div>

                <div className="relative z-20 space-y-8 lg:space-y-10 text-center lg:text-left">
                  <div className="w-fit mx-auto lg:mx-0 p-5 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-magenta/10 to-sunset/10 border border-magenta/20 shadow-inner">
                    <ActiveIcon className="h-12 w-12 lg:h-16 lg:w-16 text-magenta" />
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <h3 className="text-3xl lg:text-5xl font-black text-night tracking-tight">
                      {activeSolution?.title}
                    </h3>
                    <p className="text-lg lg:text-2xl text-ink-muted leading-relaxed font-inter max-w-2xl mx-auto lg:mx-0">
                      {activeSolution?.description}
                    </p>
                  </div>
                </div>

                {/* Decorative blob */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-magenta/[0.05] to-sunset/[0.05] rounded-full blur-3xl pointer-events-none z-0" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
