"use client";

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

  // Debug: afficher les données reçues
  console.log('🔍 FooterSection: Données footer reçues:', footer);
  console.log('🔍 FooterSection: quickLinks:', quickLinks);
  console.log('🔍 FooterSection: legalLinks:', legalLinks);
  console.log('🔍 FooterSection: socialLinks:', socialLinks);

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
              {quickLinks.map((link, index) => (
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
              {legalLinks.map((link, index) => (
                <li key={link.label || index}>
                  <a 
                    href={link.href || '#'} 
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
            {socialLinks.map((social, index) => (
              <a
                key={social.label || index}
                href={social.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-cloud px-3 py-2 text-sm text-ink-muted transition hover:border-magenta hover:text-magenta"
                title={social.label || 'Réseau social'}
              >
                {social.icon && <span className="text-base">{social.icon}</span>}
                <span className="hidden sm:inline">{social.label || 'Social'}</span>
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