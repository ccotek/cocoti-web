"use client";

import { SocialIcon, socialColors } from "../admin/SocialIcons";
import { usePathname } from "next/navigation";
import { translate } from "@/utils/translations";

type FooterSectionProps = {
  footer: {
    company: string;
    legalLinks: Array<{
      label: string;
      href: string;
    }>;
    socialLinks: Array<{
      label: string;
      href: string;
      icon?: string;
    }>;
    quickLinks: Array<{
      label: string;
      href: string;
    }>;
    copyright?: string;
  };
};

export default function FooterSection({ footer }: FooterSectionProps) {
  const legalLinks = footer?.legalLinks || [];
  const socialLinks = footer?.socialLinks || [];

  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'fr';
  const t = (key: string) => translate(key, locale);

  return (
    <footer className="bg-white border-t border-cloud/30 py-12 relative overflow-hidden">
      {/* Sub Brand-colored line on top for high-end feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-magenta/20 to-transparent" />

      <div className="container flex flex-col items-center gap-10">
        {/* Social Icons with enriched hover */}
        <div className="flex justify-center gap-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              title={social.label}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/50 border border-cloud/30 text-ink-muted hover:border-magenta/30 hover:text-magenta transition-all hover:scale-110 shadow-sm">
                {social.icon && social.icon in socialColors ? (
                  <SocialIcon
                    platform={social.icon as keyof typeof socialColors}
                    className="w-4 h-4"
                    color={socialColors[social.icon as keyof typeof socialColors]}
                  />
                ) : (
                  <span className="text-lg">{social.icon}</span>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-wider font-bold text-ink-muted/80 hover:text-night transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
              className="text-[11px] uppercase tracking-wider font-bold text-ink-muted/80 hover:text-night transition-colors"
            >
              {t("cookies.manageCookies")}
            </button>
          </div>

          <p className="text-[11px] font-bold text-ink-muted/60 uppercase tracking-[0.2em] mt-2">
            © {new Date().getFullYear()} Cocoti — {footer.copyright || (locale === 'fr' ? 'Tous droits réservés' : 'All rights reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
