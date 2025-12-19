"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import MoneyPoolGallery from "./MoneyPoolGallery";
import { formatCurrency } from "@/utils/formatAmount";

interface MoneyPoolCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    images?: string[];
    videos?: string[];
    progress: number;
    target: string | number;
    raised: string | number;
    currency: string;
    category: string;
    urgent?: boolean;
    verified?: boolean;
    locale: "fr" | "en";
    layout?: "vertical" | "horizontal" | "responsive";
    participantsCount?: number;
    status?: string;
}

export default function MoneyPoolCard({
    id,
    title,
    description,
    image,
    images = [],
    videos = [],
    progress,
    target,
    raised,
    currency,
    category,
    urgent = false,
    verified = false,
    locale,
    layout = "responsive",
    participantsCount = 0,
    status = "active",
}: MoneyPoolCardProps) {
    const isArchived = status === "archived" || status === "closed";

    // Format target and raised if they are numbers
    const formattedTarget = typeof target === 'number' ? formatCurrency(target, currency) : target;
    const formattedRaised = typeof raised === 'number' ? formatCurrency(raised, currency) : raised;

    const cardContent = (
        <div className={`group relative flex h-full flex-col overflow-hidden border border-cloud bg-white shadow-sm transition-all hover:shadow-xl ${layout === "horizontal" ? "md:flex-row md:h-[320px] rounded-[2.5rem]" :
            layout === "vertical" ? "rounded-[2rem]" :
                "md:flex-row md:h-[320px] rounded-[2rem] md:rounded-[2.5rem]"
            } ${isArchived ? "opacity-80 grayscale-[0.3]" : ""}`}>

            {/* Verified Badge Overlay */}
            {verified && (
                <div className="absolute top-4 right-4 z-20 overflow-hidden rounded-full border-2 border-white bg-green-500 p-1.5 shadow-lg" title={locale === 'fr' ? 'Vérifié' : 'Verified'}>
                    <ShieldCheckIcon className="h-4 w-4 text-white" />
                </div>
            )}

            {/* Image Section */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-magenta/5 to-sunset/5 ${layout === "horizontal" ? "w-full md:w-2/5 shrink-0 h-48 md:h-full" :
                layout === "vertical" ? "h-48 w-full" :
                    "w-full h-48 md:w-2/5 md:h-full"
                }`}>
                <MoneyPoolGallery
                    images={images.length > 0 ? images : [image]}
                    videos={videos}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    disableModal={true}
                    onClick={() => { }}
                />

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4 z-10">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-night backdrop-blur-sm shadow-sm md:text-xs">
                        {category}
                    </span>
                </div>

                {/* Urgent Badge */}
                {urgent && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="rounded-full bg-coral px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                            Urgent
                        </span>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className={`flex flex-1 flex-col p-6 md:p-8 ${layout === "horizontal" ? "md:justify-center" : ""}`}>
                <div className="flex-1">
                    <h3 className={`font-inter font-bold text-night transition-colors group-hover:text-magenta ${layout === "horizontal" ? "text-xl md:text-2xl mb-2 md:mb-3" : "text-xl mb-2"
                        } line-clamp-1`}>
                        {title}
                    </h3>
                    <p className={`font-inter text-ink-muted leading-relaxed ${layout === "horizontal" ? "text-sm md:text-base mb-6 md:mb-8 line-clamp-2 md:line-clamp-3" : "text-sm mb-6 line-clamp-2"
                        }`}>
                        {description}
                    </p>
                </div>

                {/* Progress & Stats */}
                <div className="space-y-4">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                                {locale === 'fr' ? 'Collecté' : 'Raised'}
                            </span>
                            <span className={`font-inter font-bold text-night ${layout === "horizontal" ? "text-lg md:text-2xl" : "text-lg"}`}>
                                {formattedRaised}
                                {layout === "horizontal" && <span className="hidden md:inline text-sm font-medium text-ink-muted ml-1">/ {formattedTarget}</span>}
                            </span>
                        </div>
                        <span className={`font-inter font-bold text-magenta ${layout === "horizontal" ? "text-base md:text-lg" : "text-base"}`}>
                            {progress}%
                        </span>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-cloud md:h-3">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-sunset via-magenta to-coral"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(progress, 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                            <span className="font-inter text-[10px] font-medium text-ink-muted md:hidden">
                                Obj: {formattedTarget}
                            </span>
                            {participantsCount > 0 && (
                                <span className="font-inter text-[10px] font-medium text-ink-muted">
                                    {participantsCount} {locale === 'fr' ? 'contributeurs' : 'contributors'}
                                </span>
                            )}
                        </div>

                        <div className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-black transition-all shadow-md hover:shadow-lg active:scale-95 ${isArchived
                            ? "bg-cloud text-ink-muted cursor-not-allowed"
                            : "bg-gradient-to-r from-sunset to-magenta text-white hover:scale-[1.02]"
                            }`}>
                            <span className="text-[10px] md:text-xs uppercase tracking-widest">
                                {isArchived ? (status === 'closed' ? (locale === 'fr' ? 'Fermée' : 'Closed') : (locale === 'fr' ? 'Archivée' : 'Archived')) : (locale === 'fr' ? 'Soutenir' : 'Support')}
                            </span>
                            {!isArchived && <HeartIcon className="h-4 w-4 text-white fill-white/20" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Link href={`/${locale}/money-pool/${id}`} className="block h-full">
            {cardContent}
        </Link>
    );
}
