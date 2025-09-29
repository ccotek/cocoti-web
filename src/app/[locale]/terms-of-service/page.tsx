import { Metadata } from "next";
import { DocumentTextIcon, ScaleIcon, UserGroupIcon, ShieldExclamationIcon, CurrencyEuroIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Terms of Service - Cocoti",
    description: "Terms of service and conditions of use for the Cocoti platform.",
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const legalData = {
    fr: {
      title: "Conditions Générales d'Utilisation",
      lastUpdated: "Dernière mise à jour",
      sections: [
        {
          title: "Article 1 - Objet",
          content: "Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme Cocoti, service de gestion de tontines digitales et projets collectifs. L'utilisation de notre service implique l'acceptation pleine et entière des présentes CGU."
        },
        {
          title: "Article 2 - Définitions",
          content: "Définitions des termes utilisés dans les présentes CGU.",
          definitions: [
            {
              term: "Plateforme Cocoti",
              definition: "Service numérique permettant la gestion de tontines, cagnottes et projets collectifs."
            },
            {
              term: "Utilisateur",
              definition: "Toute personne physique ou morale utilisant la plateforme Cocoti."
            },
            {
              term: "Tontine",
              definition: "Système d'épargne collective où les participants versent régulièrement une somme d'argent."
            }
          ]
        },
        {
          title: "Article 3 - Acceptation des conditions",
          content: "L'utilisation de la plateforme Cocoti implique l'acceptation sans réserve des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."
        },
        {
          title: "Article 4 - Utilisation du service",
          content: "Règles d'utilisation de notre plateforme.",
          allowed: [
            "Créer et gérer des tontines",
            "Participer à des projets collectifs",
            "Organiser des cagnottes",
            "Communiquer avec d'autres utilisateurs"
          ],
          forbidden: [
            "Activités illégales ou frauduleuses",
            "Harcèlement ou intimidation",
            "Spam ou publicité non sollicitée",
            "Violation des droits d'autrui"
          ]
        },
        {
          title: "Article 5 - Responsabilités",
          content: "Définition des responsabilités de l'utilisateur et de Cocoti."
        },
        {
          title: "Article 6 - Propriété intellectuelle",
          content: "La plateforme Cocoti et tous ses éléments (design, code, contenu) sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est interdite."
        },
        {
          title: "Article 7 - Modification des CGU",
          content: "Cocoti se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme."
        },
        {
          title: "Article 8 - Contact",
          content: "Pour toute question concernant ces conditions générales d'utilisation, vous pouvez nous contacter à l'adresse suivante : legal@cocoti.com."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated",
      sections: [
        {
          title: "Article 1 - Object",
          content: "These terms of service (ToS) govern the use of the Cocoti platform, a digital tontine and collective project management service. Use of our service implies full and complete acceptance of these ToS."
        },
        {
          title: "Article 2 - Definitions",
          content: "Definitions of terms used in these ToS.",
          definitions: [
            {
              term: "Cocoti Platform",
              definition: "Digital service enabling the management of tontines, shared funds and collective projects."
            },
            {
              term: "User",
              definition: "Any natural or legal person using the Cocoti platform."
            },
            {
              term: "Tontine",
              definition: "Collective savings system where participants regularly contribute a sum of money."
            }
          ]
        },
        {
          title: "Article 3 - Acceptance of terms",
          content: "Use of the Cocoti platform implies unreserved acceptance of these ToS. If you do not accept these terms, please do not use our service."
        },
        {
          title: "Article 4 - Service usage",
          content: "Rules for using our platform.",
          allowed: [
            "Create and manage tontines",
            "Participate in collective projects",
            "Organize shared funds",
            "Communicate with other users"
          ],
          forbidden: [
            "Illegal or fraudulent activities",
            "Harassment or intimidation",
            "Spam or unsolicited advertising",
            "Violation of others' rights"
          ]
        },
        {
          title: "Article 5 - Responsibilities",
          content: "Definition of user and Cocoti responsibilities."
        },
        {
          title: "Article 6 - Intellectual property",
          content: "The Cocoti platform and all its elements (design, code, content) are protected by intellectual property law. Any unauthorized reproduction or use is prohibited."
        },
        {
          title: "Article 7 - Modification of ToS",
          content: "Cocoti reserves the right to modify these ToS at any time. Changes take effect upon their publication on the platform."
        },
        {
          title: "Article 8 - Contact",
          content: "For any questions regarding these terms of service, you can contact us at the following address: legal@cocoti.com."
        }
      ]
    }
  };

  const data = legalData[locale];

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
              <h2 className="text-2xl font-semibold text-night mb-4 flex items-center gap-3">
                {section.title.includes("Objet") && <ScaleIcon className="w-6 h-6 text-magenta" />}
                {section.title.includes("Définitions") && <UserGroupIcon className="w-6 h-6 text-turquoise" />}
                {section.title.includes("Acceptation") && <ShieldExclamationIcon className="w-6 h-6 text-red-500" />}
                {section.title.includes("Utilisation") && <CurrencyEuroIcon className="w-6 h-6 text-green-500" />}
                {section.title.includes("Responsabilités") && <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-500" />}
                {section.title.includes("Propriété") && <DocumentTextIcon className="w-6 h-6 text-blue-500" />}
                {section.title.includes("Modification") && <EnvelopeIcon className="w-6 h-6 text-orange-500" />}
                {section.title.includes("Contact") && <InformationCircleIcon className="w-6 h-6 text-yellow-500" />}
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
                      {section.allowed.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Interdit</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {section.forbidden.map((item, itemIndex) => (
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
