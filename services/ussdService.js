const { SessionManager } = require('./sessionManager');
const { BMICalculator } = require('./bmiCalculator');
const { HealthTips } = require('./healthTips');
const { LanguageManager } = require('./languageManager');

class USSDService {
  constructor() {
    this.sessionManager = new SessionManager();
    this.bmiCalculator = new BMICalculator();
    this.healthTips = new HealthTips();
    this.languageManager = new LanguageManager();
  }

  async handleUSSD(sessionId, phoneNumber, text) {
    try {
      // Africa's Talking sends the full chain, e.g. 1*70*170*1*1
      const inputs = text ? text.split('*') : [];
      let session = await this.sessionManager.getSession(sessionId);

      if (!session) {
        session = {
          id: sessionId,
          phoneNumber,
          step: 'language_selection',
          data: {},
          language: 'en'
        };
        await this.sessionManager.saveSession(sessionId, session);
      }

      // Determine step based on input length
      let response;
      switch (inputs.length) {
        case 0:
          session.step = 'language_selection';
          response = this.getLanguageSelectionMenu(session.language);
          break;
        case 1:
          response = this.handleLanguageSelection(session, inputs[0], session.language);
          break;
        case 2:
          response = this.handleWeightInput(session, inputs[1], session.language);
          break;
        case 3:
          response = this.handleHeightInput(session, inputs[2], session.language);
          break;
        case 4:
          response = this.handleBMIResult(session, inputs[3], session.language);
          break;
        case 5:
          response = this.handleHealthTipsQuestion(session, inputs[4], session.language);
          break;
        case 6:
          response = this.handleHealthTipsResult(session, inputs[5], session.language);
          break;
        default:
          // If more steps, just repeat the last handler
          response = this.handleHealthTipsResult(session, inputs[inputs.length - 1], session.language);
      }

      // Save session after every step
      await this.sessionManager.saveSession(sessionId, session);
      return response;
    } catch (error) {
      console.error('USSD Service Error:', error);
      throw error;
    }
  }

  async processStep(session, text) {
    const lang = session.language;
    
    switch (session.step) {
      case 'language_selection':
        return this.handleLanguageSelection(session, text, lang);
      
      case 'weight_input':
        return this.handleWeightInput(session, text, lang);
      
      case 'height_input':
        return this.handleHeightInput(session, text, lang);
      
      case 'bmi_result':
        return this.handleBMIResult(session, text, lang);
      
      case 'health_tips_question':
        return this.handleHealthTipsQuestion(session, text, lang);
      
      case 'health_tips_result':
        return this.handleHealthTipsResult(session, text, lang);
      
      default:
        return this.getLanguageSelectionMenu(lang);
    }
  }

  handleLanguageSelection(session, text, lang) {
    if (text === '1') {
      session.language = 'en';
      session.step = 'weight_input';
      return this.getWeightInputMenu('en');
    } else if (text === '2') {
      session.language = 'fr';
      session.step = 'weight_input';
      return this.getWeightInputMenu('fr');
    } else if (text === '3') {
      session.language = 'rw';
      session.step = 'weight_input';
      return this.getWeightInputMenu('rw');
    } else {
      return this.getLanguageSelectionMenu(lang);
    }
  }

  handleWeightInput(session, text, lang) {
    const weight = parseFloat(text);
    
    if (isNaN(weight) || weight <= 0 || weight > 500) {
      return this.getInvalidWeightMessage(lang);
    }
    
    session.data.weight = weight;
    session.step = 'height_input';
    return this.getHeightInputMenu(lang);
  }

  handleHeightInput(session, text, lang) {
    const height = parseFloat(text);
    
    if (isNaN(height) || height <= 0 || height > 300) {
      return this.getInvalidHeightMessage(lang);
    }
    
    session.data.height = height;
    session.step = 'bmi_result';
    
    // Calculate BMI
    const bmi = this.bmiCalculator.calculateBMI(session.data.weight, session.data.height);
    const category = this.bmiCalculator.getBMICategory(bmi);
    
    session.data.bmi = bmi;
    session.data.category = category;
    
    return this.getBMIResultMenu(session.data, lang);
  }

  handleBMIResult(session, text, lang) {
    if (text === '1') {
      session.step = 'health_tips_question';
      return this.getHealthTipsQuestionMenu(lang);
    } else if (text === '2') {
      // Reset session for new calculation
      session.step = 'weight_input';
      session.data = {};
      return this.getWeightInputMenu(lang);
    } else {
      return this.getBMIResultMenu(session.data, lang);
    }
  }

  handleHealthTipsQuestion(session, text, lang) {
    if (text === '1') {
      session.step = 'health_tips_result';
      const tips = this.healthTips.getTips(session.data.category, lang);
      return this.getHealthTipsResultMenu(tips, lang);
    } else if (text === '2') {
      // End session
      return this.getGoodbyeMessage(lang);
    } else {
      return this.getHealthTipsQuestionMenu(lang);
    }
  }

  handleHealthTipsResult(session, text, lang) {
    if (text === '1') {
      // Reset session for new calculation
      session.step = 'weight_input';
      session.data = {};
      return this.getWeightInputMenu(lang);
    } else {
      return this.getGoodbyeMessage(lang);
    }
  }

  // Menu generators
  getLanguageSelectionMenu(lang) {
    const messages = {
      en: `CON Welcome to BMI Calculator
Please select your language:

1. English
2. Français
3. Kinyarwanda`,
      fr: `CON Bienvenue au Calculateur d'IMC
Veuillez sélectionner votre langue:

1. English
2. Français
3. Kinyarwanda`,
      rw: `CON Murakaza neza kuri Kalkulateri ya BMI
Nyamuneka hitamo ururimi rwawe:

1. English
2. Français
3. Kinyarwanda`
    };
    
    return messages[lang] || messages.en;
  }

  getWeightInputMenu(lang) {
    const messages = {
      en: `CON Please enter your weight in kilograms (KG):
Example: 70`,
      fr: `CON Veuillez entrer votre poids en kilogrammes (KG):
Exemple: 70`,
      rw: `CON Nyamuneka andika ibiro byawe mu magiramu (KG):
Urugero: 70`
    };
    
    return messages[lang] || messages.en;
  }

  getHeightInputMenu(lang) {
    const messages = {
      en: `CON Please enter your height in centimeters (CM):
Example: 170`,
      fr: `CON Veuillez entrer votre taille en centimètres (CM):
Exemple: 170`,
      rw: `CON Nyamuneka andika uburebure bwawe mu masentimetero (CM):
Urugero: 170`
    };
    
    return messages[lang] || messages.en;
  }

  getBMIResultMenu(data, lang) {
    const { bmi, category } = data;
    const categoryText = this.languageManager.getCategoryText(category, lang);
    
    const messages = {
      en: `CON Your BMI Result:
BMI: ${bmi.toFixed(1)}
Category: ${categoryText}

Would you like to:
1. Get health tips
2. Calculate again`,
      fr: `CON Votre Résultat IMC:
IMC: ${bmi.toFixed(1)}
Catégorie: ${categoryText}

Voulez-vous:
1. Obtenir des conseils de santé
2. Recalculer`,
      rw: `CON Ibiro byawe bya BMI:
BMI: ${bmi.toFixed(1)}
Umutekano: ${categoryText}

Ese ushaka:
1. Kubona inama z'ubuzima
2. Kubarenga`
    };
    
    return messages[lang] || messages.en;
  }

  getHealthTipsQuestionMenu(lang) {
    const messages = {
      en: `CON Would you like to receive health tips based on your BMI?

1. Yes, show me tips
2. No, thank you`,
      fr: `CON Voulez-vous recevoir des conseils de santé basés sur votre IMC?

1. Oui, montrez-moi des conseils
2. Non, merci`,
      rw: `CON Ese ushaka kubona inama z'ubuzima kubera BMI yawe?

1. Yego, nyereka inama
2. Oya, urakoze`
    };
    
    return messages[lang] || messages.en;
  }

  getHealthTipsResultMenu(tips, lang) {
    const messages = {
      en: `CON Health Tips:
${tips}

Would you like to:
1. Calculate BMI again
2. End session`,
      fr: `CON Conseils de Santé:
${tips}

Voulez-vous:
1. Recalculer l'IMC
2. Terminer la session`,
      rw: `CON Inama z'Ubuzima:
${tips}

Ese ushaka:
1. Kubarenga BMI
2. Kurangiza`
    };
    
    return messages[lang] || messages.en;
  }

  getInvalidWeightMessage(lang) {
    const messages = {
      en: `CON Invalid weight! Please enter a valid weight between 1-500 KG.`,
      fr: `CON Poids invalide! Veuillez entrer un poids valide entre 1-500 KG.`,
      rw: `CON Ibiro ntabwo ari byo! Nyamuneka andika ibiro byemewe hagati ya 1-500 KG.`
    };
    
    return messages[lang] || messages.en;
  }

  getInvalidHeightMessage(lang) {
    const messages = {
      en: `CON Invalid height! Please enter a valid height between 1-300 CM.`,
      fr: `CON Taille invalide! Veuillez entrer une taille valide entre 1-300 CM.`,
      rw: `CON Uburebure ntabwo ari bwo! Nyamuneka andika uburebure bwemewe hagati ya 1-300 CM.`
    };
    
    return messages[lang] || messages.en;
  }

  getGoodbyeMessage(lang) {
    const messages = {
      en: `END Thank you for using BMI Calculator. Stay healthy!`,
      fr: `END Merci d'avoir utilisé le Calculateur d'IMC. Restez en bonne santé!`,
      rw: `END Urakoze kwifashisha Kalkulateri ya BMI. Komeza kuba ufite ubuzima!`
    };
    
    return messages[lang] || messages.en;
  }
}

module.exports = { USSDService }; 