class LanguageManager {
  constructor() {
    this.categoryTranslations = {
      underweight: {
        en: 'Underweight',
        fr: 'Insuffisance pondérale',
        rw: 'Ibiro bike'
      },
      normal: {
        en: 'Normal Weight',
        fr: 'Poids normal',
        rw: 'Ibiro by\'ubusanzwe'
      },
      overweight: {
        en: 'Overweight',
        fr: 'Surpoids',
        rw: 'Ibiro byinshi'
      },
      obese: {
        en: 'Obese',
        fr: 'Obèse',
        rw: 'Ibiro byinshi cyane'
      }
    };

    this.messages = {
      welcome: {
        en: 'Welcome to BMI Calculator',
        fr: 'Bienvenue au Calculateur d\'IMC',
        rw: 'Murakaza neza kuri Kalkulateri ya BMI'
      },
      selectLanguage: {
        en: 'Please select your language:',
        fr: 'Veuillez sélectionner votre langue:',
        rw: 'Nyamuneka hitamo ururimi rwawe:'
      },
      enterWeight: {
        en: 'Please enter your weight in kilograms (KG):',
        fr: 'Veuillez entrer votre poids en kilogrammes (KG):',
        rw: 'Nyamuneka andika ibiro byawe mu magiramu (KG):'
      },
      enterHeight: {
        en: 'Please enter your height in centimeters (CM):',
        fr: 'Veuillez entrer votre taille en centimètres (CM):',
        rw: 'Nyamuneka andika uburebure bwawe mu masentimetero (CM):'
      },
      bmiResult: {
        en: 'Your BMI Result:',
        fr: 'Votre Résultat IMC:',
        rw: 'Ibiro byawe bya BMI:'
      },
      category: {
        en: 'Category:',
        fr: 'Catégorie:',
        rw: 'Umutekano:'
      },
      getHealthTips: {
        en: 'Would you like to:',
        fr: 'Voulez-vous:',
        rw: 'Ese ushaka:'
      },
      option1: {
        en: '1. Get health tips',
        fr: '1. Obtenir des conseils de santé',
        rw: '1. Kubona inama z\'ubuzima'
      },
      option2: {
        en: '2. Calculate again',
        fr: '2. Recalculer',
        rw: '2. Kubarenga'
      },
      healthTipsQuestion: {
        en: 'Would you like to receive health tips based on your BMI?',
        fr: 'Voulez-vous recevoir des conseils de santé basés sur votre IMC?',
        rw: 'Ese ushaka kubona inama z\'ubuzima kubera BMI yawe?'
      },
      yesShowTips: {
        en: '1. Yes, show me tips',
        fr: '1. Oui, montrez-moi des conseils',
        rw: '1. Yego, nyereka inama'
      },
      noThankYou: {
        en: '2. No, thank you',
        fr: '2. Non, merci',
        rw: '2. Oya, urakoze'
      },
      healthTips: {
        en: 'Health Tips:',
        fr: 'Conseils de Santé:',
        rw: 'Inama z\'Ubuzima:'
      },
      calculateAgain: {
        en: '1. Calculate BMI again',
        fr: '1. Recalculer l\'IMC',
        rw: '1. Kubarenga BMI'
      },
      endSession: {
        en: '2. End session',
        fr: '2. Terminer la session',
        rw: '2. Kurangiza'
      },
      invalidWeight: {
        en: 'Invalid weight! Please enter a valid weight between 1-500 KG.',
        fr: 'Poids invalide! Veuillez entrer un poids valide entre 1-500 KG.',
        rw: 'Ibiro ntabwo ari byo! Nyamuneka andika ibiro byemewe hagati ya 1-500 KG.'
      },
      invalidHeight: {
        en: 'Invalid height! Please enter a valid height between 1-300 CM.',
        fr: 'Taille invalide! Veuillez entrer une taille valide entre 1-300 CM.',
        rw: 'Uburebure ntabwo ari bwo! Nyamuneka andika uburebure bwemewe hagati ya 1-300 CM.'
      },
      goodbye: {
        en: 'Thank you for using BMI Calculator. Stay healthy!',
        fr: 'Merci d\'avoir utilisé le Calculateur d\'IMC. Restez en bonne santé!',
        rw: 'Urakoze kwifashisha Kalkulateri ya BMI. Komeza kuba ufite ubuzima!'
      },
      error: {
        en: 'An error occurred. Please try again.',
        fr: 'Une erreur s\'est produite. Veuillez réessayer.',
        rw: 'Hari ikibazo. Nyamuneka ongera ugerageze.'
      }
    };
  }

  getCategoryText(category, language = 'en') {
    return this.categoryTranslations[category]?.[language] || 
           this.categoryTranslations[category]?.en || 
           category;
  }

  getMessage(messageKey, language = 'en') {
    return this.messages[messageKey]?.[language] || 
           this.messages[messageKey]?.en || 
           messageKey;
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'rw', name: 'Kinyarwanda' }
    ];
  }

  isValidLanguage(languageCode) {
    return ['en', 'fr', 'rw'].includes(languageCode);
  }

  getLanguageName(languageCode) {
    const languages = {
      en: 'English',
      fr: 'Français',
      rw: 'Kinyarwanda'
    };
    return languages[languageCode] || languageCode;
  }

  // Format BMI result message
  formatBMIResult(bmi, category, language = 'en') {
    const categoryText = this.getCategoryText(category, language);
    const bmiResultText = this.getMessage('bmiResult', language);
    const categoryLabel = this.getMessage('category', language);
    
    return `${bmiResultText}\nBMI: ${bmi.toFixed(1)}\n${categoryLabel} ${categoryText}`;
  }

  // Format menu options
  formatMenuOptions(options, language = 'en') {
    return options.map((option, index) => {
      const optionText = this.getMessage(option.key, language);
      return `${index + 1}. ${optionText}`;
    }).join('\n');
  }

  // Get validation error message
  getValidationError(field, language = 'en') {
    const errors = {
      weight: {
        en: 'Please enter a valid weight between 1-500 KG.',
        fr: 'Veuillez entrer un poids valide entre 1-500 KG.',
        rw: 'Nyamuneka andika ibiro byemewe hagati ya 1-500 KG.'
      },
      height: {
        en: 'Please enter a valid height between 1-300 CM.',
        fr: 'Veuillez entrer une taille valide entre 1-300 CM.',
        rw: 'Nyamuneka andika uburebure bwemewe hagati ya 1-300 CM.'
      }
    };

    return errors[field]?.[language] || errors[field]?.en || 'Invalid input';
  }

  // Get confirmation message
  getConfirmationMessage(action, language = 'en') {
    const confirmations = {
      restart: {
        en: 'Session restarted. Please enter your weight:',
        fr: 'Session redémarrée. Veuillez entrer votre poids:',
        rw: 'Gahunda yatangiriye. Nyamuneka andika ibiro byawe:'
      },
      continue: {
        en: 'Continuing with your session...',
        fr: 'Continuer avec votre session...',
        rw: 'Komeza gahunda yawe...'
      }
    };

    return confirmations[action]?.[language] || confirmations[action]?.en || '';
  }
}

module.exports = { LanguageManager }; 