// Service d'authentification pour cocoti-web
export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isNewUser: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserRegistration {
  phone: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface OTPResponse {
  success: boolean;
  message?: string;
}

export class AuthService {
  private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private readonly OTP_CODE = process.env.NEXT_PUBLIC_OTP_CODE || '123456';
  private readonly OTP_LENGTH = 6;
  private readonly MIN_PHONE_LENGTH = 6;

  // Demander un code OTP
  async requestOTP(phone: string): Promise<OTPResponse> {
    try {
      // Pour l'instant, simulation de l'API
      console.log(`OTP envoyé au ${phone}. Code: ${this.OTP_CODE}`);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Code OTP envoyé' };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'OTP:', error);
      return { success: false, message: 'Erreur lors de l\'envoi du code' };
    }
  }

  // Vérifier le code OTP et se connecter
  async verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
    try {
      // Vérifier le code OTP
      if (otp !== this.OTP_CODE) {
        return { success: false, message: 'Code OTP incorrect' };
      }

      // Pour l'instant, simulation de la vérification utilisateur
      // Dans une vraie implémentation, on ferait un appel API
      const userExists = this.checkUserExists(phone);
      
      if (userExists) {
        // Utilisateur existant - connexion directe
        const user: User = {
          id: `user_${Date.now()}`,
          phone,
          firstName: 'Utilisateur',
          lastName: 'Existant',
          fullName: 'Utilisateur Existant',
          isNewUser: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        return { success: true, message: 'Connexion réussie', user };
      }

      // Nouvel utilisateur - retourner l'info pour l'inscription
      return { 
        success: true, 
        message: 'Code OTP vérifié. Veuillez compléter votre profil.', 
        user: null 
      };
    } catch (error) {
      console.error('Erreur lors de la vérification OTP:', error);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  }

  // Créer un nouvel utilisateur
  async createUser(userData: UserRegistration): Promise<AuthResponse> {
    try {
      // Pour l'instant, simulation de la création
      const user: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        isNewUser: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: 'Compte créé avec succès', user };
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      return { success: false, message: 'Erreur lors de la création du compte' };
    }
  }

  // Vérifier si un utilisateur existe (simulation)
  private checkUserExists(phone: string): boolean {
    // Pour l'instant, simulation - on considère que l'utilisateur n'existe pas
    return false;
  }

  // Valider le format du numéro de téléphone
  validatePhone(phone: string): { isValid: boolean; message?: string } {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < this.MIN_PHONE_LENGTH) {
      return { 
        isValid: false, 
        message: `Le numéro doit contenir au moins ${this.MIN_PHONE_LENGTH} chiffres` 
      };
    }

    return { isValid: true };
  }

  // Valider le code OTP
  validateOTP(otp: string): { isValid: boolean; message?: string } {
    if (!otp || otp.length !== this.OTP_LENGTH) {
      return { 
        isValid: false, 
        message: `Le code OTP doit contenir ${this.OTP_LENGTH} chiffres` 
      };
    }

    if (!/^\d+$/.test(otp)) {
      return { 
        isValid: false, 
        message: 'Le code OTP ne doit contenir que des chiffres' 
      };
    }

    return { isValid: true };
  }

  // Valider la description (nombre minimum de mots)
  validateDescription(description: string, minWords: number = 10): { isValid: boolean; message?: string } {
    const words = description.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length < minWords) {
      return { 
        isValid: false, 
        message: `La description doit contenir au moins ${minWords} mots (actuellement: ${words.length})` 
      };
    }

    return { isValid: true };
  }
}

// Instance singleton
export const authService = new AuthService();
