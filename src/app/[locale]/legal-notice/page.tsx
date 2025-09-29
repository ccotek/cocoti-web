import { Metadata } from "next";
import { BuildingOfficeIcon, UserIcon, GlobeAltIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, ShieldExclamationIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Legal Notice - Cocoti",
    description: "Legal information about the publisher of the Cocoti website.",
  };
}

export default async function LegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const legalData = {
    fr: {
      title: "Mentions légales",
      subtitle: "Informations légales sur l'éditeur du site",
      sections: [
        {
          title: "Éditeur du site",
          content: "Informations sur l'entreprise éditrice du site.",
          company: {
            name: "Cocoti SAS",
            address: "123 Avenue de la République, 75011 Paris, France",
            phone: "+33 1 23 45 67 89",
            email: "contact@cocoti.com"
          }
        },
        {
          title: "Directeur de publication",
          content: "Le directeur de la publication est le Président de Cocoti SAS."
        },
        {
          title: "Hébergement",
          content: "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA."
        },
        {
          title: "Propriété intellectuelle",
          content: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés."
        },
        {
          title: "Responsabilité",
          content: "Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions."
        },
        {
          title: "Liens hypertextes",
          content: "Des liens hypertextes peuvent être présents sur le site. L'utilisateur est informé qu'en cliquant sur ces liens, il sortira du site cocoti.com."
        }
      ]
    },
    en: {
      title: "Legal Notice",
      subtitle: "Legal information about the site publisher",
      sections: [
        {
          title: "Site publisher",
          content: "Information about the company publishing the site.",
          company: {
            name: "Cocoti SAS",
            address: "123 Avenue de la République, 75011 Paris, France",
            phone: "+33 1 23 45 67 89",
            email: "contact@cocoti.com"
          }
        },
        {
          title: "Publication director",
          content: "The publication director is the President of Cocoti SAS."
        },
        {
          title: "Hosting",
          content: "The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA."
        },
        {
          title: "Intellectual property",
          content: "This entire site is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved."
        },
        {
          title: "Liability",
          content: "The information contained on this site is as accurate as possible and the site is updated at different times of the year, but may nevertheless contain inaccuracies or omissions."
        },
        {
          title: "Hyperlinks",
          content: "Hyperlinks may be present on the site. The user is informed that by clicking on these links, they will leave the cocoti.com site."
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
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-night mb-4">
            {data.title}
          </h1>
          <p className="text-lg text-ink-muted">
            {data.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">
          {data.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold text-night mb-4 flex items-center gap-3">
                {section.title.includes("Éditeur") && <BuildingOfficeIcon className="w-6 h-6 text-magenta" />}
                {section.title.includes("Directeur") && <UserIcon className="w-6 h-6 text-turquoise" />}
                {section.title.includes("Hébergement") && <GlobeAltIcon className="w-6 h-6 text-sunset" />}
                {section.title.includes("Propriété") && <DocumentTextIcon className="w-6 h-6 text-blue-500" />}
                {section.title.includes("Responsabilité") && <ShieldExclamationIcon className="w-6 h-6 text-red-500" />}
                {section.title.includes("Liens") && <LinkIcon className="w-6 h-6 text-green-500" />}
                {section.title}
              </h2>
              <p className="text-ink-muted leading-relaxed mb-4">
                {section.content}
              </p>
              
              {section.company && (
                <div className="p-6 bg-ivory rounded-2xl border border-cloud">
                  <h3 className="font-semibold text-night mb-3">Informations de l'entreprise</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-magenta" />
                      <span className="text-ink-muted">{section.company.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-magenta" />
                      <span className="text-ink-muted">{section.company.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-magenta" />
                      <span className="text-ink-muted">{section.company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-magenta" />
                      <a href={`mailto:${section.company.email}`} className="text-magenta hover:underline">
                        {section.company.email}
                      </a>
                    </div>
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
