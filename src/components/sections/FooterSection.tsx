"use client";

type FooterSectionProps = {
  footer: {
    links: Array<{
      label: string;
      href: string;
    }>;
    socials: Array<{
      label: string;
      href: string;
    }>;
    company: string;
  };
};

export default function FooterSection({ footer }: FooterSectionProps) {
  return (
    <footer className="border-t border-cloud/60 bg-ivory/90">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sunset to-magenta font-bold text-white">
              C
            </div>
            <span>Cocoti</span>
          </div>
          <p className="max-w-xs text-sm text-ink-muted">{footer.company}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {footer.links.map((link) => (
            <a key={link.label} href={link.href} className="text-ink-muted transition hover:text-night">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          {footer.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cloud px-3 py-1 text-ink-muted transition hover:border-magenta hover:text-magenta"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-cloud/50 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Cocoti. All rights reserved.
      </div>
    </footer>
  );
}
