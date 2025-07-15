class HealthTips {
  constructor() {
    this.tips = {
      underweight: {
        en: [
          "• Eat more calories than you burn",
          "• Include protein-rich foods (meat, fish, eggs, beans)",
          "• Add healthy fats (nuts, avocados, olive oil)",
          "• Eat frequent meals throughout the day",
          "• Include strength training exercises",
          "• Consider nutritional supplements if needed"
        ],
        fr: [
          "• Mangez plus de calories que vous n'en brûlez",
          "• Incluez des aliments riches en protéines (viande, poisson, œufs, haricots)",
          "• Ajoutez des graisses saines (noix, avocats, huile d'olive)",
          "• Mangez des repas fréquents tout au long de la journée",
          "• Incluez des exercices de musculation",
          "• Considérez des suppléments nutritionnels si nécessaire"
        ],
        rw: [
          "• Rya kalori nyinshi kurusha uko ukoresha",
          "• Ongera ibiryo byuzuye protini (inyama, ifi, amagi, ibishyimbo)",
          "• Ongera amavuta meza (ubunyobwa, avoka, amavuta y'umutemeri)",
          "• Rya amafunguro ya buri munsi",
          "• Ongera imikino yo gufasha ububasha",
          "• Tekereza vitamini niba akenewe"
        ]
      },
      normal: {
        en: [
          "• Maintain your current healthy weight",
          "• Eat a balanced diet with fruits and vegetables",
          "• Exercise regularly (150 minutes/week)",
          "• Stay hydrated by drinking water",
          "• Get adequate sleep (7-9 hours)",
          "• Avoid processed foods and excess sugar"
        ],
        fr: [
          "• Maintenez votre poids santé actuel",
          "• Mangez une alimentation équilibrée avec fruits et légumes",
          "• Faites de l'exercice régulièrement (150 minutes/semaine)",
          "• Restez hydraté en buvant de l'eau",
          "• Dormez suffisamment (7-9 heures)",
          "• Évitez les aliments transformés et l'excès de sucre"
        ],
        rw: [
          "• Komeza ibiro byawe by'ubu ufite ubuzima",
          "• Rya amafunguro yuzuye amashyamba n'imboga",
          "• Kora imikino ya buri munsi (iminota 150 ku wa cumi)",
          "• Nywa amazi ya buri munsi",
          "• Rara amasaha 7-9",
          "• Reka ibiryo byoherejwe n'isukari nyinshi"
        ]
      },
      overweight: {
        en: [
          "• Reduce calorie intake gradually",
          "• Increase physical activity (30 minutes/day)",
          "• Eat more vegetables and lean proteins",
          "• Limit processed foods and sugary drinks",
          "• Practice portion control",
          "• Consider working with a nutritionist"
        ],
        fr: [
          "• Réduisez progressivement l'apport calorique",
          "• Augmentez l'activité physique (30 minutes/jour)",
          "• Mangez plus de légumes et de protéines maigres",
          "• Limitez les aliments transformés et les boissons sucrées",
          "• Pratiquez le contrôle des portions",
          "• Considérez travailler avec un nutritionniste"
        ],
        rw: [
          "• Kugabanya kalori buhoro buhoro",
          "• Ongera imikino (iminota 30 ku munsi)",
          "• Rya imboga nyinshi n'ibiryo byuzuye protini",
          "• Reka ibiryo byoherejwe n'ibinyobwa byuzuye isukari",
          "• Kugenzura umubare w'ibiryo",
          "• Tekereza gukorana n'umwarimu w'ibiryo"
        ]
      },
      obese: {
        en: [
          "• Consult a healthcare provider for guidance",
          "• Start with low-impact exercises (walking, swimming)",
          "• Focus on portion control and meal planning",
          "• Keep a food diary to track intake",
          "• Join a support group or weight loss program",
          "• Consider medical weight loss options"
        ],
        fr: [
          "• Consultez un professionnel de la santé pour des conseils",
          "• Commencez par des exercices à faible impact (marche, natation)",
          "• Concentrez-vous sur le contrôle des portions et la planification des repas",
          "• Tenez un journal alimentaire pour suivre l'apport",
          "• Rejoignez un groupe de soutien ou un programme de perte de poids",
          "• Considérez les options médicales de perte de poids"
        ],
        rw: [
          "• Vugana n'umwarimu w'ubuzima kugira ngo akugenzure",
          "• Tangira imikino itagira ingaruka (kugenda, koga)",
          "• Tekereza kugenzura umubare w'ibiryo n'uburyo bwo kurya",
          "• Andika ibiryo uko ubirya",
          "• Jya mu itsinda ry'ubufasha cyangwa gahunda yo kugabanya ibiro",
          "• Tekereza uburyo bwo kugabanya ibiro"
        ]
      }
    };
  }

  getTips(category, language = 'en') {
    const categoryTips = this.tips[category];
    if (!categoryTips) {
      return this.getDefaultTips(language);
    }

    const tips = categoryTips[language] || categoryTips.en;
    return tips.join('\n');
  }

  getDefaultTips(language = 'en') {
    const defaultTips = {
      en: [
        "• Eat a balanced diet",
        "• Exercise regularly",
        "• Stay hydrated",
        "• Get adequate sleep",
        "• Consult a healthcare provider"
      ],
      fr: [
        "• Mangez une alimentation équilibrée",
        "• Faites de l'exercice régulièrement",
        "• Restez hydraté",
        "• Dormez suffisamment",
        "• Consultez un professionnel de la santé"
      ],
      rw: [
        "• Rya amafunguro yuzuye",
        "• Kora imikino ya buri munsi",
        "• Nywa amazi",
        "• Rara amasaha akenewe",
        "• Vugana n'umwarimu w'ubuzima"
      ]
    };

    const tips = defaultTips[language] || defaultTips.en;
    return tips.join('\n');
  }

  getSpecificTip(category, language = 'en', tipIndex = 0) {
    const categoryTips = this.tips[category];
    if (!categoryTips) {
      return this.getDefaultTips(language).split('\n')[tipIndex] || '';
    }

    const tips = categoryTips[language] || categoryTips.en;
    return tips[tipIndex] || tips[0] || '';
  }

  getRandomTip(category, language = 'en') {
    const categoryTips = this.tips[category];
    if (!categoryTips) {
      const defaultTips = this.getDefaultTips(language).split('\n');
      return defaultTips[Math.floor(Math.random() * defaultTips.length)];
    }

    const tips = categoryTips[language] || categoryTips.en;
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Additional health advice methods
  getExerciseRecommendations(category, language = 'en') {
    const exercises = {
      underweight: {
        en: "Focus on strength training and muscle building exercises",
        fr: "Concentrez-vous sur la musculation et les exercices de développement musculaire",
        rw: "Tekereza imikino yo gufasha ububasha n'ubwoko"
      },
      normal: {
        en: "Mix of cardio and strength training for maintenance",
        fr: "Mélange de cardio et de musculation pour l'entretien",
        rw: "Guhuza imikino yo gufasha umutima n'ububasha"
      },
      overweight: {
        en: "Start with walking, swimming, or cycling",
        fr: "Commencez par la marche, la natation ou le vélo",
        rw: "Tangira kugenda, koga, cyangwa gutwara igare"
      },
      obese: {
        en: "Begin with low-impact activities like walking",
        fr: "Commencez par des activités à faible impact comme la marche",
        rw: "Tangira imikino itagira ingaruka nka kugenda"
      }
    };

    return exercises[category]?.[language] || exercises[category]?.en || exercises.normal.en;
  }

  getNutritionAdvice(category, language = 'en') {
    const nutrition = {
      underweight: {
        en: "Increase protein and healthy fat intake",
        fr: "Augmentez l'apport en protéines et en graisses saines",
        rw: "Ongera ibiryo byuzuye protini n'amavuta meza"
      },
      normal: {
        en: "Maintain balanced nutrition with variety",
        fr: "Maintenez une nutrition équilibrée avec de la variété",
        rw: "Komeza amafunguro yuzuye n'ubwoko bwinshi"
      },
      overweight: {
        en: "Reduce portion sizes and increase vegetables",
        fr: "Réduisez la taille des portions et augmentez les légumes",
        rw: "Kugabanya umubare w'ibiryo n'ongera imboga"
      },
      obese: {
        en: "Focus on whole foods and portion control",
        fr: "Concentrez-vous sur les aliments entiers et le contrôle des portions",
        rw: "Tekereza ibiryo byuzuye n'uburyo bwo kugenzura"
      }
    };

    return nutrition[category]?.[language] || nutrition[category]?.en || nutrition.normal.en;
  }
}

module.exports = { HealthTips }; 