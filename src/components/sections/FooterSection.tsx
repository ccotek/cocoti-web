"use client";

import { SocialIcon, socialColors } from "../admin/SocialIcons";

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
  };
};

export default function FooterSection({ footer }: FooterSectionProps) {
  // Utiliser les données de l'admin, pas de fallback par défaut
  const quickLinks = footer?.quickLinks || [];
  const legalLinks = footer?.legalLinks || [];
  const socialLinks = footer?.socialLinks || [];
  const company = footer?.company || "";
  const copyright = footer?.copyright || "";


  return (
    <footer className="border-t border-cloud/60 bg-ivory/90">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sunset to-magenta font-bold text-white">
                C
              </div>
              <span>Cocoti</span>
            </div>
            <p className="max-w-md text-sm text-ink-muted leading-relaxed">
              {company}
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold text-night mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks && Array.isArray(quickLinks) && quickLinks.map((link, index) => (
                <li key={link.label || index}>
                  <a 
                    href={link.href || '#'} 
                    className="text-sm text-ink-muted transition hover:text-night"
                  >
                    {link.label || 'Lien'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="font-semibold text-night mb-4">Légal</h3>
                <ul className="space-y-2">
                  {legalLinks && Array.isArray(legalLinks) && legalLinks.map((link, index) => (
                    <li key={link.label || index}>
                      <a 
                        href={link.href || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink-muted transition hover:text-night"
                      >
                        {link.label || 'Lien légal'}
                      </a>
                    </li>
                  ))}
                </ul>
          </div>
        </div>

        {/* Réseaux sociaux et copyright */}
        <div className="mt-8 pt-8 border-t border-cloud/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            {socialLinks && Array.isArray(socialLinks) && socialLinks.map((social, index) => (
              <a
                key={social.label || index}
                href={social.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-cloud text-ink-muted transition hover:border-magenta hover:text-magenta hover:scale-110"
                title={social.label || social.icon || 'Réseau social'}
              >
                {social.icon && social.icon in socialColors ? (
                  <SocialIcon 
                    platform={social.icon as keyof typeof socialColors} 
                    className="w-5 h-5"
                    color={socialColors[social.icon as keyof typeof socialColors]}
                  />
                ) : (
                  <span className="text-lg">{social.icon}</span>
                )}
              </a>
            ))}
          </div>
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Cocoti. {footer.copyright || 'Tous droits réservés.'}
          </p>
        </div>
      </div>
    </footer>
  );
}