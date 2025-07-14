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
        sw: [
          "• Kula kalori zaidi kuliko unazotumia",
          "• Jumuisha vyakula vya protini (nyama, samaki, mayai, maharagwe)",
          "• Ongeza mafuta mazuri (karanga, parachichi, mafuta ya zeituni)",
          "• Kula milo ya mara kwa mara siku nzima",
          "• Jumuisha mazoezi ya kujenga nguvu",
          "• Fikiria vitamini ikiwa inahitajika"
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
        sw: [
          "• Weka uzito wako wa sasa wenye afya",
          "• Kula chakula cha usawa na matunda na mboga",
          "• Fanya mazoezi mara kwa mara (dakika 150 kwa wiki)",
          "• Kaa na maji kwa kunywa maji",
          "• Lala kutosha (saa 7-9)",
          "• Epuka vyakula vilivyochakatwa na sukari ya ziada"
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
        sw: [
          "• Punguza kalori kwa hatua",
          "• Ongeza shughuli za mwili (dakika 30 kwa siku)",
          "• Kula mboga zaidi na protini nyepesi",
          "• Punguza vyakula vilivyochakatwa na vinywaji vya sukari",
          "• Dhibiti kiasi cha chakula",
          "• Fikiria kufanya kazi na mtaalam wa lishe"
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
        sw: [
          "• Shauriana na mtaalam wa afya kwa mwongozo",
          "• Anza na mazoezi ya athari ya chini (kutembea, kuogelea)",
          "• Elekeza kwenye udhibiti wa kiasi na mpango wa milo",
          "• Weka daftari la chakula kufuatilia ulaji",
          "• Jiunge na kikundi cha usaidizi au mpango wa kupunguza uzito",
          "• Fikiria chaguzi za matibabu za kupunguza uzito"
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
      sw: [
        "• Kula chakula cha usawa",
        "• Fanya mazoezi mara kwa mara",
        "• Kaa na maji",
        "• Lala kutosha",
        "• Shauriana na mtaalam wa afya"
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
        sw: "Elekeza kwenye mazoezi ya nguvu na kujenga misuli"
      },
      normal: {
        en: "Mix of cardio and strength training for maintenance",
        fr: "Mélange de cardio et de musculation pour l'entretien",
        sw: "Mchanganyiko wa kardio na mazoezi ya nguvu kwa matunzo"
      },
      overweight: {
        en: "Start with walking, swimming, or cycling",
        fr: "Commencez par la marche, la natation ou le vélo",
        sw: "Anza na kutembea, kuogelea, au baiskeli"
      },
      obese: {
        en: "Begin with low-impact activities like walking",
        fr: "Commencez par des activités à faible impact comme la marche",
        sw: "Anza na shughuli za athari ya chini kama kutembea"
      }
    };

    return exercises[category]?.[language] || exercises[category]?.en || exercises.normal.en;
  }

  getNutritionAdvice(category, language = 'en') {
    const nutrition = {
      underweight: {
        en: "Increase protein and healthy fat intake",
        fr: "Augmentez l'apport en protéines et en graisses saines",
        sw: "Ongeza ulaji wa protini na mafuta mazuri"
      },
      normal: {
        en: "Maintain balanced nutrition with variety",
        fr: "Maintenez une nutrition équilibrée avec de la variété",
        sw: "Weka lishe ya usawa na aina mbalimbali"
      },
      overweight: {
        en: "Reduce portion sizes and increase vegetables",
        fr: "Réduisez la taille des portions et augmentez les légumes",
        sw: "Punguza ukubwa wa sehemu na ongeza mboga"
      },
      obese: {
        en: "Focus on whole foods and portion control",
        fr: "Concentrez-vous sur les aliments entiers et le contrôle des portions",
        sw: "Elekeza kwenye vyakula kamili na udhibiti wa sehemu"
      }
    };

    return nutrition[category]?.[language] || nutrition[category]?.en || nutrition.normal.en;
  }
}

module.exports = { HealthTips }; 