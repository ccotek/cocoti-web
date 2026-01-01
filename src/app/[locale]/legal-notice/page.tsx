import { Metadata } from "next";
import { BuildingOfficeIcon, UserIcon, GlobeAltIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, ShieldExclamationIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { promises as fs } from 'fs';
import path from 'path';

// Définir le type pour les sections légales
interface LegalSection {
  title: string;
  content: string;
  company?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // Lire le titre directement depuis le fichier JSON
  let title = locale === 'fr' ? 'Mentions légales' : 'Legal Notice';
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'i18n', 'messages', `${locale}.json`);
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (data.legal?.title) {
      title = data.legal.title;
    }
  } catch (error) {
    console.warn('Impossible de lire le fichier JSON, utilisation du titre par défaut:', error);
  }
  
  return {
    title: `${title} - Cocoti`,
    description: locale === 'fr' 
      ? "Informations légales sur l'éditeur du site Cocoti."
      : "Legal information about the publisher of the Cocoti website.",
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg'
    }
  };
}

// Forcer la page à ne pas être mise en cache
export const dynamic = 'force-dynamic';

export default async function LegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Lire les données directement depuis le fichier JSON
  let legalData;
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'i18n', 'messages', `${locale}.json`);
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (data.legal) {
      legalData = data.legal;
    } else {
      throw new Error('No legal data in JSON file');
    }
  } catch (error) {
    console.warn('Impossible de lire le fichier JSON, utilisation des données par défaut:', error);
    // Données par défaut si le fichier JSON n'est pas accessible
    legalData = {
      title: locale === 'fr' ? "Mentions légales" : "Legal Notice",
      subtitle: locale === 'fr' ? "Informations légales sur l'éditeur du site" : "Legal information about the site publisher",
      sections: [
        {
          title: locale === 'fr' ? "Éditeur du site" : "Site publisher",
          content: locale === 'fr' ? "Informations sur l'entreprise éditrice du site." : "Information about the company publishing the site.",
          company: {
            name: "Cocoti SAS",
            address: "123 Avenue de la République, 75011 Paris, France",
            phone: "+33 1 23 45 67 89",
            email: "contact@cocoti.app"
          }
        },
        {
          title: locale === 'fr' ? "Directeur de publication" : "Publication director",
          content: locale === 'fr' ? "Le directeur de la publication est le Président de Cocoti SAS." : "The publication director is the President of Cocoti SAS."
        },
        {
          title: locale === 'fr' ? "Hébergement" : "Hosting",
          content: locale === 'fr' ? "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA." : "The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA."
        },
        {
          title: locale === 'fr' ? "Propriété intellectuelle" : "Intellectual property",
          content: locale === 'fr' ? "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés." : "This entire site is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved."
        },
        {
          title: locale === 'fr' ? "Responsabilité" : "Liability",
          content: locale === 'fr' ? "Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions." : "The information contained on this site is as accurate as possible and the site is updated at different times of the year, but may nevertheless contain inaccuracies or omissions."
        },
        {
          title: locale === 'fr' ? "Liens hypertextes" : "Hyperlinks",
          content: locale === 'fr' ? "Des liens hypertextes peuvent être présents sur le site. L'utilisateur est informé qu'en cliquant sur ces liens, il sortira du site cocoti.app." : "Hyperlinks may be present on the site. The user is informed that by clicking on these links, they will leave the cocoti.app site."
        }
      ]
    };
  }

  return (
    <div className="min-h-screen bg-sand py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sunset to-magenta rounded-2xl flex items-center justify-center mb-6 shadow-glow">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-night mb-4">
            {legalData.title}
          </h1>
          <p className="text-lg text-ink-muted">
            {legalData.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">
          {legalData.sections.map((section: LegalSection, index: number) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold text-night mb-4 flex items-center gap-3">
                {(section.title.includes("Éditeur") || section.title.includes("Site publisher")) && <BuildingOfficeIcon className="w-6 h-6 text-magenta" />}
                {(section.title.includes("Directeur") || section.title.includes("Publication director")) && <UserIcon className="w-6 h-6 text-turquoise" />}
                {(section.title.includes("Hébergement") || section.title.includes("Hosting")) && <GlobeAltIcon className="w-6 h-6 text-sunset" />}
                {(section.title.includes("Propriété") || section.title.includes("Intellectual property")) && <DocumentTextIcon className="w-6 h-6 text-blue-500" />}
                {(section.title.includes("Responsabilité") || section.title.includes("Liability")) && <ShieldExclamationIcon className="w-6 h-6 text-red-500" />}
                {(section.title.includes("Liens") || section.title.includes("Hyperlinks")) && <LinkIcon className="w-6 h-6 text-green-500" />}
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
