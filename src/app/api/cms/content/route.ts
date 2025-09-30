import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Fonction pour lire le fichier JSON
async function readJsonFile(locale: string) {
  const jsonPath = path.join(process.cwd(), 'src', 'i18n', 'messages', `${locale}.json`);
  const fileContent = await fs.readFile(jsonPath, 'utf-8');
  return JSON.parse(fileContent);
}

// Fonction pour écrire le fichier JSON
async function writeJsonFile(locale: string, data: any) {
  const jsonPath = path.join(process.cwd(), 'src', 'i18n', 'messages', `${locale}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Récupérer le contenu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'fr';
    
    const content = await readJsonFile(locale);
    
    console.log(`📖 Contenu récupéré pour ${locale}:`, content.legal ? 'Section legal présente' : 'Section legal manquante');
    if (content.legal) {
      console.log(`📝 Titre legal:`, content.legal.title);
      if (content.legal.sections) {
        const editeurSection = content.legal.sections.find(s => s.title.includes('Éditeur'));
        if (editeurSection && editeurSection.company) {
          console.log(`🏢 Nom entreprise:`, editeurSection.company.name);
          console.log(`📧 Email entreprise:`, editeurSection.company.email);
        }
      }
    }
    
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// PUT - Mettre à jour le contenu
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'fr';
    const section = searchParams.get('section');
    
    if (!section) {
      return NextResponse.json({ success: false, error: 'Section manquante' }, { status: 400 });
    }
    
    const body = await request.json();
    const { content } = body;
    
    // Lire le fichier existant
    const data = await readJsonFile(locale);
    
    // Mettre à jour la section
    data[section] = content;
    
    // Écrire le fichier mis à jour
    await writeJsonFile(locale, data);
    
    console.log(`✅ Contenu mis à jour: ${section} (${locale})`);
    console.log(`📝 Données sauvegardées:`, JSON.stringify(content, null, 2));
    
    return NextResponse.json({ success: true, message: 'Contenu mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
