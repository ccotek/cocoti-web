import { Metadata } from "next";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { readTermsOfServiceMarkdown } from "@/utils/markdownReader";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const data = readTermsOfServiceMarkdown(locale as 'fr' | 'en');
  
  return {
    title: `${data.title} - Cocoti`,
    description: locale === 'fr' 
      ? "Conditions générales d'utilisation pour la plateforme Cocoti."
      : "Terms of service and conditions of use for the Cocoti platform.",
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg'
    }
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Lire les données depuis les fichiers Markdown
  const data = readTermsOfServiceMarkdown(locale as 'fr' | 'en');

  return (
    <div className="min-h-screen bg-sand py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sunset to-magenta rounded-2xl flex items-center justify-center mb-6 shadow-glow">
            <DocumentTextIcon className="w-8 h-8 text-white" />
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
              
              {section.definitions && (
                <div className="space-y-3">
                  {section.definitions.map((def, defIndex) => (
                    <div key={defIndex} className="p-4 bg-ivory rounded-2xl border border-cloud">
                      <h4 className="font-semibold text-night mb-1">{def.term}</h4>
                      <p className="text-ink-muted text-sm">{def.definition}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.allowed && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Autorisé</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      {section.allowed?.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Interdit</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {section.forbidden?.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </div>
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
