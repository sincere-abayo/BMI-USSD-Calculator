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
      const inputs = text ? text.split('*') : [];
      let session = await this.sessionManager.getSession(sessionId);

      if (!session) {
        session = {
          id: sessionId,
          phoneNumber,
          step: 'language_selection',
          data: {},
          language: 'en',
          history: []
        };
        await this.sessionManager.saveSession(sessionId, session);
      }

      // Handle Back (98) and Home (99)
      const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : '';
      if (lastInput === '98') {
        // Back: pop last step from history
        if (session.history && session.history.length > 0) {
          const prev = session.history.pop();
          session.step = prev.step;
          session.data = prev.data;
          session.language = prev.language;
          await this.sessionManager.saveSession(sessionId, session);
          return this.getMenuForStep(session);
        } else {
          // If no history, go to language selection
          session.step = 'language_selection';
          session.data = {};
          await this.sessionManager.saveSession(sessionId, session);
          return this.getLanguageSelectionMenu(session.language);
        }
      } else if (lastInput === '99') {
        // Home: reset to language selection
        session.step = 'language_selection';
        session.data = {};
        session.history = [];
        await this.sessionManager.saveSession(sessionId, session);
        return this.getLanguageSelectionMenu(session.language);
      }

      // Save current step to history before moving forward
      if (!session.history) session.history = [];
      if (['weight_input', 'height_input', 'bmi_result', 'health_tips_question', 'health_tips_result'].includes(session.step)) {
        session.history.push({
          step: session.step,
          data: { ...session.data },
          language: session.language
        });
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
          response = this.handleHealthTipsResult(session, inputs[inputs.length - 1], session.language);
      }

      await this.sessionManager.saveSession(sessionId, session);
      return response;
    } catch (error) {
      console.error('USSD Service Error:', error);
      throw error;
    }
  }

  getMenuForStep(session) {
    switch (session.step) {
      case 'weight_input':
        return this.getWeightInputMenu(session.language);
      case 'height_input':
        return this.getHeightInputMenu(session.language);
      case 'bmi_result':
        return this.getBMIResultMenu(session.data, session.language);
      case 'health_tips_question':
        return this.getHealthTipsQuestionMenu(session.language);
      case 'health_tips_result':
        return this.getHealthTipsResultMenu(this.healthTips.getTips(session.data.category, session.language), session.language);
      default:
        return this.getLanguageSelectionMenu(session.language);
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
      return this.getGoodbyeMessage(lang);
    } else {
      return this.getHealthTipsQuestionMenu(lang);
    }
  }

  handleHealthTipsResult(session, text, lang) {
    if (text === '1') {
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
      en: `CON Welcome to BMI Calculator\nPlease select your language:\n\n1. English\n2. Français\n3. Kinyarwanda`,
      fr: `CON Bienvenue au Calculateur d'IMC\nVeuillez sélectionner votre langue:\n\n1. English\n2. Français\n3. Kinyarwanda`,
      rw: `CON Murakaza neza kuri Kalkulateri ya BMI\nNyamuneka hitamo ururimi rwawe:\n\n1. English\n2. Français\n3. Kinyarwanda`
    };
    return messages[lang] || messages.en;
  }

  getWeightInputMenu(lang) {
    const messages = {
      en: `CON Please enter your weight in kilograms (KG):\nExample: 70\n98. Back\n99. Home`,
      fr: `CON Veuillez entrer votre poids en kilogrammes (KG):\nExemple: 70\n98. Retour\n99. Accueil`,
      rw: `CON Nyamuneka andika ibiro byawe mu magiramu (KG):\nUrugero: 70\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getHeightInputMenu(lang) {
    const messages = {
      en: `CON Please enter your height in centimeters (CM):\nExample: 170\n98. Back\n99. Home`,
      fr: `CON Veuillez entrer votre taille en centimètres (CM):\nExemple: 170\n98. Retour\n99. Accueil`,
      rw: `CON Nyamuneka andika uburebure bwawe mu masentimetero (CM):\nUrugero: 170\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getBMIResultMenu(data, lang) {
    const { bmi, category } = data;
    const categoryText = this.languageManager.getCategoryText(category, lang);
    const messages = {
      en: `CON Your BMI Result:\nBMI: ${bmi.toFixed(1)}\nCategory: ${categoryText}\n\nWould you like to:\n1. Get health tips\n2. Calculate again\n98. Back\n99. Home`,
      fr: `CON Votre Résultat IMC:\nIMC: ${bmi.toFixed(1)}\nCatégorie: ${categoryText}\n\nVoulez-vous:\n1. Obtenir des conseils de santé\n2. Recalculer\n98. Retour\n99. Accueil`,
      rw: `CON Ibiro byawe bya BMI:\nBMI: ${bmi.toFixed(1)}\nUmutekano: ${categoryText}\n\nEse ushaka:\n1. Kubona inama z'ubuzima\n2. Kubarenga\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getHealthTipsQuestionMenu(lang) {
    const messages = {
      en: `CON Would you like to receive health tips based on your BMI?\n\n1. Yes, show me tips\n2. No, thank you\n98. Back\n99. Home`,
      fr: `CON Voulez-vous recevoir des conseils de santé basés sur votre IMC?\n\n1. Oui, montrez-moi des conseils\n2. Non, merci\n98. Retour\n99. Accueil`,
      rw: `CON Ese ushaka kubona inama z'ubuzima kubera BMI yawe?\n\n1. Yego, nyereka inama\n2. Oya, urakoze\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getHealthTipsResultMenu(tips, lang) {
    const messages = {
      en: `CON Health Tips:\n${tips}\n\nWould you like to:\n1. Calculate BMI again\n2. End session\n98. Back\n99. Home`,
      fr: `CON Conseils de Santé:\n${tips}\n\nVoulez-vous:\n1. Recalculer l'IMC\n2. Terminer la session\n98. Retour\n99. Accueil`,
      rw: `CON Inama z'Ubuzima:\n${tips}\n\nEse ushaka:\n1. Kubarenga BMI\n2. Kurangiza\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getInvalidWeightMessage(lang) {
    const messages = {
      en: `CON Invalid weight! Please enter a valid weight between 1-500 KG.\n98. Back\n99. Home`,
      fr: `CON Poids invalide! Veuillez entrer un poids valide entre 1-500 KG.\n98. Retour\n99. Accueil`,
      rw: `CON Ibiro ntabwo ari byo! Nyamuneka andika ibiro byemewe hagati ya 1-500 KG.\n98. Subira inyuma\n99. Ahabanza`
    };
    return messages[lang] || messages.en;
  }

  getInvalidHeightMessage(lang) {
    const messages = {
      en: `CON Invalid height! Please enter a valid height between 1-300 CM.\n98. Back\n99. Home`,
      fr: `CON Taille invalide! Veuillez entrer une taille valide entre 1-300 CM.\n98. Retour\n99. Accueil`,
      rw: `CON Uburebure ntabwo ari bwo! Nyamuneka andika uburebure bwemewe hagati ya 1-300 CM.\n98. Subira inyuma\n99. Ahabanza`
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