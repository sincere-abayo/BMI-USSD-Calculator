class BMICalculator {
  constructor() {
    this.categories = {
      underweight: { min: 0, max: 18.4, name: 'underweight' },
      normal: { min: 18.5, max: 24.9, name: 'normal' },
      overweight: { min: 25.0, max: 29.9, name: 'overweight' },
      obese: { min: 30.0, max: 100, name: 'obese' }
    };
  }

  calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
      throw new Error('Invalid weight or height values');
    }

    // Convert height from cm to meters
    const heightM = heightCm / 100;
    
    // BMI formula: weight (kg) / height (m)²
    const bmi = weightKg / (heightM * heightM);
    
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  }

  getBMICategory(bmi) {
    if (bmi < 18.5) {
      return 'underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'normal';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return 'overweight';
    } else {
      return 'obese';
    }
  }

  getBMIRange(category) {
    return this.categories[category] || null;
  }

  isValidWeight(weight) {
    return weight > 0 && weight <= 500;
  }

  isValidHeight(height) {
    return height > 0 && height <= 300;
  }

  // Additional utility methods
  getIdealWeightRange(heightCm, gender = 'neutral') {
    const heightM = heightCm / 100;
    
    // Using different formulas based on gender
    let minBMI, maxBMI;
    
    if (gender === 'male') {
      minBMI = 20.0;
      maxBMI = 25.0;
    } else if (gender === 'female') {
      minBMI = 18.5;
      maxBMI = 24.0;
    } else {
      minBMI = 18.5;
      maxBMI = 24.9;
    }
    
    const minWeight = minBMI * (heightM * heightM);
    const maxWeight = maxBMI * (heightM * heightM);
    
    return {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    };
  }

  getWeightToLose(currentWeight, targetBMI, heightCm) {
    const heightM = heightCm / 100;
    const targetWeight = targetBMI * (heightM * heightM);
    const weightToLose = currentWeight - targetWeight;
    
    return weightToLose > 0 ? Math.round(weightToLose * 10) / 10 : 0;
  }

  getWeightToGain(currentWeight, targetBMI, heightCm) {
    const heightM = heightCm / 100;
    const targetWeight = targetBMI * (heightM * heightM);
    const weightToGain = targetWeight - currentWeight;
    
    return weightToGain > 0 ? Math.round(weightToGain * 10) / 10 : 0;
  }
}

module.exports = { BMICalculator }; 