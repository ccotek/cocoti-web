import { Metadata } from "next";
import { InformationCircleIcon, ShieldCheckIcon, MegaphoneIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { readPrivacyPolicyMarkdown } from "@/utils/markdownReader";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await params;
  const data = readPrivacyPolicyMarkdown(locale as 'fr' | 'en');
  
  return {
    title: `${data.title} - Cocoti`,
    description: locale === 'fr' 
      ? "Politique de confidentialité et informations sur les cookies pour la plateforme Cocoti."
      : "Privacy policy and cookie information for the Cocoti platform.",
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg'
    }
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Lire les données depuis les fichiers Markdown
  const data = readPrivacyPolicyMarkdown(locale as 'fr' | 'en');

  return (
    <div className="min-h-screen bg-sand py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sunset to-magenta rounded-2xl flex items-center justify-center mb-6 shadow-glow">
            <InformationCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-night mb-4">
            {data.title}
          </h1>
          <p className="text-lg text-ink-muted">
            {data.lastUpdated} : {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">
          {data.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold text-night mb-4">
                {section.title}
              </h2>
              <p className="text-ink-muted leading-relaxed mb-4">
                {section.content}
              </p>
              
              {section.subsections && (
                <div className="grid gap-6">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="p-6 bg-ivory rounded-2xl border border-cloud">
                      <h3 className="text-lg font-semibold text-night mb-2 flex items-center gap-2">
                        {subsection.title === "Cookies nécessaires" && <ShieldCheckIcon className="w-5 h-5 text-green-500" />}
                        {subsection.title === "Cookies de préférences" && <Cog6ToothIcon className="w-5 h-5 text-blue-500" />}
                        {subsection.title === "Cookies marketing" && <MegaphoneIcon className="w-5 h-5 text-red-500" />}
                        {subsection.title === "Cookies analytiques" && <InformationCircleIcon className="w-5 h-5 text-yellow-500" />}
                        {subsection.title}
                      </h3>
                      <p className="text-ink-muted mb-3">
                        {subsection.content}
                      </p>
                      {subsection.items && (
                        <ul className="list-disc list-inside text-ink-muted text-sm space-y-1">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl font-medium hover:shadow-glow transition-all"
          >
            {locale === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </a>
        </div>
      </div>
    </div>
  );
}
