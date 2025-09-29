import { Metadata } from "next";
import { InformationCircleIcon, ShieldCheckIcon, MegaphoneIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Privacy Policy - Cocoti",
    description: "Privacy policy and cookie information for the Cocoti platform.",
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const legalData = {
    fr: {
      title: "Politique de Confidentialité",
      lastUpdated: "Dernière mise à jour",
      sections: [
        {
          title: "Introduction",
          content: "Chez Cocoti, nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme."
        },
        {
          title: "Types de cookies utilisés",
          content: "Nous utilisons différents types de cookies pour améliorer votre expérience sur notre site web.",
          subsections: [
            {
              title: "Cookies nécessaires",
              content: "Ces cookies sont essentiels au fonctionnement de notre site web. Ils vous permettent de naviguer sur le site et d'utiliser ses fonctionnalités de base.",
              items: [
                "Authentification de l'utilisateur",
                "Sécurité et prévention de la fraude",
                "Mémorisation des préférences de consentement aux cookies"
              ]
            },
            {
              title: "Cookies de préférences",
              content: "Ces cookies permettent à notre site web de se souvenir des informations qui modifient la façon dont le site se comporte ou se présente.",
              items: [
                "Préférences linguistiques",
                "Paramètres d'affichage (ex: mode sombre/clair)"
              ]
            },
            {
              title: "Cookies marketing",
              content: "Ces cookies sont utilisés pour suivre les visiteurs sur les sites web afin d'afficher des publicités pertinentes.",
              items: [
                "Publicité ciblée",
                "Mesure de l'efficacité des campagnes publicitaires",
                "Intégration avec les réseaux sociaux"
              ]
            },
            {
              title: "Cookies analytiques",
              content: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site web en collectant et en rapportant des informations de manière anonyme.",
              items: [
                "Statistiques de visite (ex: Google Analytics)",
                "Amélioration des performances du site",
                "Détection des erreurs"
              ]
            }
          ]
        },
        {
          title: "Vos droits",
          content: "Conformément au RGPD, vous avez le droit d'accéder à vos données personnelles, de les rectifier, de demander leur suppression, de limiter leur traitement, de vous opposer à leur traitement et le droit à la portabilité de vos données. Vous pouvez exercer ces droits en nous contactant."
        },
        {
          title: "Contact",
          content: "Pour toute question concernant cette politique de confidentialité ou vos données personnelles, vous pouvez nous contacter à l'adresse suivante : privacy@cocoti.com."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated",
      sections: [
        {
          title: "Introduction",
          content: "At Cocoti, we are committed to protecting your privacy and personal data. This policy explains how we collect, use and protect your information when you use our platform."
        },
        {
          title: "Types of cookies used",
          content: "We use different types of cookies to improve your experience on our website.",
          subsections: [
            {
              title: "Necessary cookies",
              content: "These cookies are essential for the functioning of our website. They allow you to navigate the site and use its basic features.",
              items: [
                "User authentication",
                "Security and fraud prevention",
                "Remembering cookie consent preferences"
              ]
            },
            {
              title: "Preference cookies",
              content: "These cookies allow our website to remember information that changes how the site behaves or appears.",
              items: [
                "Language preferences",
                "Display settings (e.g. dark/light mode)"
              ]
            },
            {
              title: "Marketing cookies",
              content: "These cookies are used to track visitors on websites to display relevant advertisements.",
              items: [
                "Targeted advertising",
                "Measuring advertising campaign effectiveness",
                "Social media integration"
              ]
            },
            {
              title: "Analytics cookies",
              content: "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously.",
              items: [
                "Visit statistics (ex: Google Analytics)",
                "Website performance improvement",
                "Error detection"
              ]
            }
          ]
        },
        {
          title: "Your rights",
          content: "In accordance with GDPR, you have the right to access your personal data, rectify it, request its deletion, limit its processing, object to its processing and the right to data portability. You can exercise these rights by contacting us."
        },
        {
          title: "Contact",
          content: "For any questions regarding this privacy policy or your personal data, you can contact us at the following address: privacy@cocoti.com."
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
