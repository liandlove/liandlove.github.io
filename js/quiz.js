import { PRODUCTS } from './products.js';

// Quiz State Management
class QuizState {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.scores = {};
    this.questions = [];
    this.isCompleted = false;
  }

  reset() {
    this.currentQuestion = 0;
    this.answers = {};
    this.scores = {};
    this.isCompleted = false;
  }

  addAnswer(questionId, answer) {
    this.answers[questionId] = answer;
  }

  nextQuestion() {
    this.currentQuestion++;
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestion];
  }

  isLastQuestion() {
    return this.currentQuestion === this.questions.length - 1;
  }

  hasAnswer(questionId) {
    return this.answers.hasOwnProperty(questionId);
  }

  getAnswer(questionId) {
    return this.answers[questionId];
  }
}

// Quiz Questions Configuration
const QUIZ_QUESTIONS = [
  {
    id: 'style',
    title: 'Jaki styl najbardziej Ci odpowiada?',
    options: [
      {
        id: 'minimal',
        text: 'Minimalistyczny i prosty',
        scores: { style: 'minimal', complexity: 'simple' }
      },
      {
        id: 'elegant',
        text: 'Elegancki i wyrafinowany',
        scores: { style: 'elegant', complexity: 'medium' }
      },
      {
        id: 'bold',
        text: 'Odważny i wyróżniający się',
        scores: { style: 'bold', complexity: 'complex' }
      }
    ]
  },
  {
    id: 'colors',
    title: 'Jakie kolory lubisz nosić?',
    options: [
      {
        id: 'black',
        text: 'Czarne i ciemne odcienie',
        scores: { colors: ['black', 'gray'], contrast: 'high' }
      },
      {
        id: 'silver',
        text: 'Srebrne i metaliczne',
        scores: { colors: ['silver'], contrast: 'medium' }
      },
      {
        id: 'colorful',
        text: 'Kolorowe i wielobarwne',
        scores: { colors: ['mixed'], contrast: 'low' }
      }
    ]
  },
  {
    id: 'usage',
    title: 'Kiedy najczęściej będziesz nosić bransoletkę?',
    options: [
      {
        id: 'daily',
        text: 'Codziennie, do pracy i na co dzień',
        scores: { usage: 'daily', durability: 'high' }
      },
      {
        id: 'special',
        text: 'Na specjalne okazje i wyjścia',
        scores: { usage: 'special', durability: 'medium' }
      },
      {
        id: 'mixed',
        text: 'Zarówno na co dzień, jak i na okazje',
        scores: { usage: 'mixed', durability: 'medium' }
      }
    ]
  },
  {
    id: 'personality',
    title: 'Jakie jest Twoje podejście do dodatków?',
    options: [
      {
        id: 'subtle',
        text: 'Subtelne, niedostrzegalne szczegóły',
        scores: { personality: 'subtle', statement: 'quiet' }
      },
      {
        id: 'balanced',
        text: 'Równowaga między dyskrecją a wyrazistością',
        scores: { personality: 'balanced', statement: 'moderate' }
      },
      {
        id: 'standout',
        text: 'Chcę, żeby były zauważalne',
        scores: { personality: 'standout', statement: 'bold' }
      }
    ]
  },
  {
    id: 'gender',
    title: 'Jaka płeć?',
    options: [
      {
        id: 'male',
        text: 'Mężczyzna',
        scores: { gender: 'male' }
      },
      {
        id: 'female',
        text: 'Kobieta',
        scores: { gender: 'female' }
      },
      {
        id: 'no_preference',
        text: 'Nie chcę odpowiadać',
        scores: { gender: null }
      }
    ]
  },
  {
    id: 'meaning',
    title: 'Czy dodatek ma dla Ciebie znaczenie symboliczne?',
    options: [
      {
        id: 'important',
        text: 'Tak, symbolika jest dla mnie ważna',
        scores: { meaning: 'important', symbolism: 'high' }
      },
      {
        id: 'neutral',
        text: 'Nie ma to dla mnie znaczenia',
        scores: { meaning: 'neutral', symbolism: 'low' }
      },
      {
        id: 'bonus',
        text: 'Miły dodatek, ale nie konieczny',
        scores: { meaning: 'bonus', symbolism: 'medium' }
      }
    ]
  }
];

// Scoring weights configuration
const SCORE_WEIGHTS = {
  style: 2.5,
  colors: 2.0,
  usage: 1.5,
  materials: 1.5,
  budget: 1.0,
  gender: 2.5,
  personality: 0.5
};

// Product Scoring System - Real Matching Algorithm
class ProductScorer {
  constructor(products) {
    this.products = products;
  }

  calculateScores(answers) {
    console.log('Quiz answers:', answers);
    
    // Build user profile from answers
    const userProfile = this.buildUserProfile(answers);
    console.log('User profile:', userProfile);
    
    // Initialize scores for all products
    const productScores = {};
    this.products.forEach(product => {
      productScores[product.id] = {
        total: 0,
        styleMatch: 0,
        colorMatch: 0,
        usageMatch: 0,
        materialMatch: 0,
        budgetMatch: 0,
        categoryMatch: 0
      };
    });

    // Calculate scores for each product based on user profile
    this.products.forEach(product => {
      const score = this.calculateProductScore(product, userProfile);
      productScores[product.id] = score;
    });

    console.log('Product scores:', productScores);
    
    return productScores;
  }

  buildUserProfile(answers) {
    const profile = {
      style: null,
      colors: [],
      usage: null,
      materials: null,
      budget: null,
      personality: null,
      gender: null,
      meaning: null
    };

    // Extract preferences from answers
    Object.values(answers).forEach(answer => {
      if (answer && answer.scores) {
        const scores = answer.scores;
        
        // Style preference
        if (scores.style) profile.style = scores.style;
        
        // Color preferences
        if (scores.colors) {
          if (Array.isArray(scores.colors)) {
            profile.colors = [...new Set([...profile.colors, ...scores.colors])];
          } else {
            profile.colors.push(scores.colors);
          }
        }
        
        // Usage preference
        if (scores.usage) profile.usage = scores.usage;
        
        // Materials preference
        if (scores.materials) profile.materials = scores.materials;
        
        // Budget preference
        if (scores.priceRange) profile.budget = scores.priceRange;
        
        // Gender preference
        if (scores.gender !== undefined) profile.gender = scores.gender;
        
        // Personality preference
        if (scores.personality) profile.personality = scores.personality;
        
        // Meaning preference
        if (scores.meaning) profile.meaning = scores.meaning;
      }
    });

    return profile;
  }

  calculateProductScore(product, userProfile) {
    let score = {
      total: 0,
      styleMatch: 0,
      colorMatch: 0,
      usageMatch: 0,
      materialMatch: 0,
      metalMatch: 0,
      genderMatch: 0,
      budgetMatch: 0,
      categoryMatch: 0
    };

    // Style matching
    if (userProfile.style) {
      score.styleMatch = this.matchStyle(product, userProfile.style);
      score.total += score.styleMatch * SCORE_WEIGHTS.style;
    }

    // Color matching
    if (userProfile.colors.length > 0) {
      score.colorMatch = this.matchColors(product, userProfile.colors);
      score.total += score.colorMatch * SCORE_WEIGHTS.colors;
    }

    // Usage matching
    if (userProfile.usage) {
      score.usageMatch = this.matchUsage(product, userProfile.usage);
      score.total += score.usageMatch * SCORE_WEIGHTS.usage;
    }

    // Materials matching
    if (userProfile.materials) {
      score.materialMatch = this.matchMaterials(product, userProfile.materials);
      score.total += score.materialMatch * SCORE_WEIGHTS.materials;
    }

    // Budget matching
    if (userProfile.budget) {
      score.budgetMatch = this.matchBudget(product, userProfile.budget);
      score.total += score.budgetMatch * SCORE_WEIGHTS.budget;
    }

    // Gender matching (only if not null)
    if (userProfile.gender !== null && userProfile.gender !== undefined) {
      score.genderMatch = this.matchGender(product, userProfile.gender);
      score.total += score.genderMatch * SCORE_WEIGHTS.gender;
    }

    // Category matching for personality
    if (userProfile.personality) {
      score.categoryMatch = this.matchCategory(product, userProfile.personality);
      score.total += score.categoryMatch * SCORE_WEIGHTS.personality;
    }

    return score;
  }

  matchStyle(product, style) {
    const categories = product.categories || [];
    const styleMap = {
      minimal: ['Miasta', 'Kolekcja'],
      elegant: ['Symbole', 'Kolekcja'],
      bold: ['Symbole', 'Kolekcja']
    };

    if (categories.some(cat => styleMap[style]?.includes(cat))) {
      return 10; // Perfect match
    }
    return 3; // No match
  }

  matchColors(product, colors) {
    const productColors = product.colors || [];
    if (productColors.length === 0) return 3;
    
    let matchScore = 0;
    colors.forEach(color => {
      if (productColors.includes(color)) {
        matchScore += 10; // 10 points per matching color
      }
    });
    
    return matchScore > 0 ? Math.min(matchScore, 20) : 3; // Max 20 points
  }

  matchUsage(product, usage) {
    // All bracelets are suitable for mixed usage
    if (usage === 'mixed') return 10;
    if (usage === 'daily') return 8; // Most products are daily-wearable
    if (usage === 'special') return 6;
    
    return 5; // Default score
  }

  matchMaterials(product, materials) {
    const specs = product.specs || {};
    if (materials === 'stones' && specs.kamienie) return 10;
    if (materials === 'metal' && product.material === 'sterling_silver') return 10;
    if (materials === 'mixed' && specs.kamienie && product.material === 'sterling_silver') return 10;
    
    return 5; // Default score
  }

  matchMetal(product, metal) {
    if (metal === 'silver' && product.material === 'sterling_silver') return 10;
    if (metal === 'gold' && product.material === 'gold') return 10;
    if (metal === 'rose-gold' && product.material === 'rose_gold') return 10;
    
    return 5; // Default score
  }

  matchBudget(product, priceRange) {
    const price = product.price || 0;
    
    if (price >= priceRange[0] && price <= priceRange[1]) {
      return 10; // Perfect budget match
    }
    
    // Close matches
    if (price < priceRange[0] && (priceRange[0] - price) <= 50) return 8;
    if (price > priceRange[1] && (price - priceRange[1]) <= 50) return 6;
    
    // Out of budget
    if (price < priceRange[0]) return 4; // Under budget
    if (price > priceRange[1]) return 2; // Over budget
    
    return 5; // Default
  }

  matchCategory(product, personality) {
    const categories = product.categories || [];
    const personalityMap = {
      subtle: ['Miasta', 'Kolekcja'],
      balanced: ['Kolekcja', 'Miasta'],
      standout: ['Symbole']
    };

    if (categories.some(cat => personalityMap[personality]?.includes(cat))) {
      return 10; // Perfect match
    }
    return 3; // No match
  }

  matchGender(product, gender) {
    // Safe handling for null/undefined gender
    if (!gender) return 5; // Neutral score for no preference
    
    // Safe handling for missing categories
    const categories = product.categories || [];
    
    // Check if product has gender-specific categories
    if (gender === 'male' && categories.includes('Męskie')) {
      return 10; // Perfect match for male
    }
    if (gender === 'female' && !categories.includes('Męskie')) {
      return 10; // Perfect match for female (any non-male category)
    }
    
    return 3; // No specific gender match
  }

  getBestMatch(productScores) {
    const sortedProducts = Object.entries(productScores)
      .sort(([,a], [,b]) => b.total - a.total)
      .map(([productId, scores]) => ({
        product: this.products.find(p => p.id === productId),
        scores
      }));

    return sortedProducts;
  }
}

// Quiz UI Controller
class QuizUI {
  constructor(state, scorer) {
    this.state = state;
    this.scorer = scorer;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Screens
    this.welcomeScreen = document.getElementById('welcomeScreen');
    this.questionScreen = document.getElementById('questionScreen');
    this.resultScreen = document.getElementById('resultScreen');

    // Progress
    this.progressFill = document.getElementById('progressFill');
    this.currentQuestionEl = document.getElementById('currentQuestion');
    this.totalQuestionsEl = document.getElementById('totalQuestions');

    // Question elements
    this.questionTitle = document.getElementById('questionTitle');
    this.questionOptions = document.getElementById('questionOptions');
    this.backBtn = document.getElementById('backBtn');
    this.nextBtn = document.getElementById('nextBtn');

    // Result elements
    this.resultProduct = document.getElementById('resultProduct');
    this.resultAlternatives = document.getElementById('resultAlternatives');

    // Actions
    this.startQuizBtn = document.getElementById('startQuizBtn');
    this.restartQuizBtn = document.getElementById('restartQuizBtn');
  }

  bindEvents() {
    this.startQuizBtn.addEventListener('click', () => this.startQuiz());
    this.restartQuizBtn.addEventListener('click', () => this.restartQuiz());
    this.backBtn.addEventListener('click', () => this.previousQuestion());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
  }

  startQuiz() {
    this.state.questions = QUIZ_QUESTIONS;
    this.totalQuestionsEl.textContent = this.state.questions.length;
    this.showScreen('question');
    this.renderQuestion();
  }

  restartQuiz() {
    this.state.reset();
    this.showScreen('welcome');
  }

  showScreen(screenName) {
    const screens = {
      welcome: this.welcomeScreen,
      question: this.questionScreen,
      result: this.resultScreen
    };

    Object.values(screens).forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('active');
    });

    screens[screenName].classList.remove('hidden');
    
    // Add active class for transitions
    setTimeout(() => {
      screens[screenName].classList.add('active');
    }, 50);
  }

  renderQuestion() {
    const question = this.state.getCurrentQuestion();
    this.currentQuestionEl.textContent = this.state.currentQuestion + 1;
    this.updateProgress();
    
    this.questionTitle.textContent = question.title;
    this.renderOptions(question);
    this.updateButtons();
  }

  renderOptions(question) {
    this.questionOptions.innerHTML = '';
    
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'option-button';
      button.type = 'button';
      button.setAttribute('data-option-id', option.id);
      
      const isSelected = this.state.getAnswer(question.id)?.id === option.id;
      if (isSelected) {
        button.classList.add('selected');
      }

      button.innerHTML = `
        <span class="option-indicator"></span>
        <span class="option-text">${option.text}</span>
      `;

      button.addEventListener('click', () => this.selectOption(question.id, option));
      this.questionOptions.appendChild(button);
    });
  }

  selectOption(questionId, option) {
    this.state.addAnswer(questionId, option);
    
    // Update UI
    const buttons = this.questionOptions.querySelectorAll('.option-button');
    buttons.forEach(btn => {
      const isSelected = btn.getAttribute('data-option-id') === option.id;
      btn.classList.toggle('selected', isSelected);
    });

    this.updateButtons();
  }

  updateButtons() {
    const hasAnswer = this.state.hasAnswer(this.state.getCurrentQuestion().id);
    this.nextBtn.disabled = !hasAnswer;
    this.backBtn.disabled = this.state.currentQuestion === 0;
    
    if (this.state.isLastQuestion()) {
      this.nextBtn.textContent = 'Zobacz wynik';
    } else {
      this.nextBtn.textContent = 'Dalej';
    }
  }

  updateProgress() {
    const progress = ((this.state.currentQuestion + 1) / this.state.questions.length) * 100;
    this.progressFill.style.width = `${progress}%`;
  }

  nextQuestion() {
    if (this.state.isLastQuestion()) {
      this.showResults();
    } else {
      this.state.nextQuestion();
      this.renderQuestion();
    }
  }

  previousQuestion() {
    this.state.previousQuestion();
    this.renderQuestion();
  }

  showResults() {
    const scores = this.scorer.calculateScores(this.state.answers);
    const bestMatches = this.scorer.getBestMatch(scores);
    
    this.renderResults(bestMatches);
    this.showScreen('result');
  }

  renderResults(bestMatches) {
    const [mainProduct, ...alternatives] = bestMatches;
    
    this.renderMainProduct(mainProduct);
    this.renderAlternatives(alternatives.slice(0, 2)); // Show top 2 alternatives
  }

  renderMainProduct({ product, scores }) {
    const imageUrl = product.images?.[0] || './assets/images/bracelet-hero.png';
    
    this.resultProduct.innerHTML = `
      <img src="${imageUrl}" alt="${product.name}" class="result-product-image" />
      <h3 class="result-product-name">${product.name}</h3>
      <div class="result-product-price">${this.formatPrice(product.price, product.currency)}</div>
      <p class="result-product-description">${product.description || 'Elegancka bransoletka, która doskonale uzupełni Twój styl.'}</p>
      <button class="btn btn-primary" data-product-id="${product.id}">Zamów bransoletkę</button>
    `;
  }

  renderAlternatives(alternatives) {
    if (alternatives.length === 0) {
      this.resultAlternatives.innerHTML = '';
      return;
    }

    this.resultAlternatives.innerHTML = `
      <h3 class="result-alternatives-title">Inne propozycje</h3>
      <div class="result-alternatives-list">
        ${alternatives.map(({ product }) => `
          <button class="alternative-product" data-product-id="${product.id}">
            <img src="${product.images?.[0] || './assets/images/bracelet-hero.png'}" 
                 alt="${product.name}" 
                 class="alternative-product-image" />
            <div class="alternative-product-info">
              <div class="alternative-product-name">${product.name}</div>
              <div class="alternative-product-price">${this.formatPrice(product.price, product.currency)}</div>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  formatPrice(value, currency) {
    try {
      return new Intl.NumberFormat('pl-PL', {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${value}`;
    }
  }
}

// Initialize Quiz
window.addEventListener('load', () => {
  const state = new QuizState();
  const scorer = new ProductScorer(PRODUCTS);
  const ui = new QuizUI(state, scorer);
  
  // Initialize product modal immediately after everything loads
  if (typeof initProductModal === 'function') {
    initProductModal(PRODUCTS);
  }
  
  // Add event listeners for product modal functionality
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Handle main product button
    if (target.matches('.btn[data-product-id]') || target.closest('.btn[data-product-id]')) {
      e.preventDefault();
      const button = target.matches('.btn[data-product-id]') ? target : target.closest('.btn[data-product-id]');
      const productId = button.getAttribute('data-product-id');
      const product = PRODUCTS.find(p => p.id === productId);
      
      if (product) {
        console.log('Opening modal for product:', product.id);
        console.log('Product modal available:', !!window.productModal);
        
        // Use the standard product modal
        if (window.productModal) {
          window.productModal.open(product);
        } else {
          console.error('Product modal not available, redirecting to contact');
          window.location.href = './index.html#contact';
        }
      }
    }
    
    // Handle alternative product buttons
    if (target.matches('.alternative-product[data-product-id]') || target.closest('.alternative-product[data-product-id]')) {
      e.preventDefault();
      const button = target.matches('.alternative-product[data-product-id]') ? target : target.closest('.alternative-product[data-product-id]');
      const productId = button.getAttribute('data-product-id');
      const product = PRODUCTS.find(p => p.id === productId);
      
      if (product) {
        console.log('Opening modal for alternative product:', product.id);
        console.log('Product modal available:', !!window.productModal);
        
        // Use the standard product modal
        if (window.productModal) {
          window.productModal.open(product);
        } else {
          console.error('Product modal not available, redirecting to contact');
          window.location.href = './index.html#contact';
        }
      }
    }
  });
  
  // Make quiz available globally for debugging
  window.quiz = { state, scorer, ui };
});
