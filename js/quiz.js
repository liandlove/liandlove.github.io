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
    id: 'materials',
    title: 'Jakie materiały preferujesz?',
    options: [
      {
        id: 'stones',
        text: 'Naturalne kamienie i minerały',
        scores: { materials: 'stones', nature: 'high' }
      },
      {
        id: 'metal',
        text: 'Głównie metal i srebro',
        scores: { materials: 'metal', nature: 'low' }
      },
      {
        id: 'mixed',
        text: 'Połączenie kamieni i metalu',
        scores: { materials: 'mixed', nature: 'medium' }
      }
    ]
  },
  {
    id: 'size',
    title: 'Jaką wielkość bransoletki wolisz?',
    options: [
      {
        id: 'delicate',
        text: 'Delikatna i cienka',
        scores: { size: 'delicate', weight: 'light' }
      },
      {
        id: 'medium',
        text: 'Średnia, klasyczna',
        scores: { size: 'medium', weight: 'medium' }
      },
      {
        id: 'chunky',
        text: 'Grubsza, bardziej wyrazista',
        scores: { size: 'chunky', weight: 'heavy' }
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
  },
  {
    id: 'budget',
    title: 'Jaki jest Twój przewidywany budżet?',
    options: [
      {
        id: 'affordable',
        text: 'Do 150 zł',
        scores: { budget: 'low', priceRange: [0, 150] }
      },
      {
        id: 'medium',
        text: '150-250 zł',
        scores: { budget: 'medium', priceRange: [150, 250] }
      },
      {
        id: 'premium',
        text: 'Powyżej 250 zł',
        scores: { budget: 'high', priceRange: [250, 1000] }
      }
    ]
  }
];

// Product Scoring System
class ProductScorer {
  constructor(products) {
    this.products = products;
  }

  calculateScores(answers) {
    const productScores = {};
    
    // Initialize scores for all products
    this.products.forEach(product => {
      productScores[product.id] = {
        total: 0,
        style: 0,
        colors: 0,
        usage: 0,
        personality: 0,
        materials: 0,
        size: 0,
        meaning: 0,
        budget: 0
      };
    });

    // Calculate scores based on answers
    Object.values(answers).forEach(answer => {
      if (answer && answer.scores) {
        this.products.forEach(product => {
          const score = this.calculateProductScore(product, answer.scores);
          productScores[product.id].total += score.total;
          productScores[product.id].style += score.style || 0;
          productScores[product.id].colors += score.colors || 0;
          productScores[product.id].usage += score.usage || 0;
          productScores[product.id].personality += score.personality || 0;
          productScores[product.id].materials += score.materials || 0;
          productScores[product.id].size += score.size || 0;
          productScores[product.id].meaning += score.meaning || 0;
          productScores[product.id].budget += score.budget || 0;
        });
      }
    });

    return productScores;
  }

  calculateProductScore(product, answerScores) {
    let score = { total: 0 };
    
    // Style matching
    if (answerScores.style) {
      score.style = this.matchStyle(product, answerScores.style);
      score.total += score.style;
    }

    // Color matching
    if (answerScores.colors) {
      score.colors = this.matchColors(product, answerScores.colors);
      score.total += score.colors;
    }

    // Usage matching
    if (answerScores.usage) {
      score.usage = this.matchUsage(product, answerScores.usage);
      score.total += score.usage;
    }

    // Personality matching
    if (answerScores.personality) {
      score.personality = this.matchPersonality(product, answerScores.personality);
      score.total += score.personality;
    }

    // Materials matching
    if (answerScores.materials) {
      score.materials = this.matchMaterials(product, answerScores.materials);
      score.total += score.materials;
    }

    // Size matching (based on product characteristics)
    if (answerScores.size) {
      score.size = this.matchSize(product, answerScores.size);
      score.total += score.size;
    }

    // Meaning matching (based on categories)
    if (answerScores.meaning) {
      score.meaning = this.matchMeaning(product, answerScores.meaning);
      score.total += score.meaning;
    }

    // Budget matching
    if (answerScores.priceRange) {
      score.budget = this.matchBudget(product, answerScores.priceRange);
      score.total += score.budget;
    }

    return score;
  }

  matchStyle(product, style) {
    const styleMap = {
      minimal: ['Miasta', 'Kolekcja'],
      elegant: ['Symbole', 'Kolekcja'],
      bold: ['Symbole', 'Kolekcja']
    };

    if (product.categories && product.categories.some(cat => styleMap[style]?.includes(cat))) {
      return 10;
    }
    return 3;
  }

  matchColors(product, colors) {
    if (!product.colors) return 3;
    
    if (colors.includes('mixed')) return 8;
    if (colors.includes('black') && product.colors.includes('black')) return 10;
    if (colors.includes('silver') && product.colors.includes('silver')) return 10;
    if (colors.includes('gray') && product.colors.includes('gray')) return 8;
    
    return 3;
  }

  matchUsage(product, usage) {
    // All products are suitable for mixed usage
    if (usage === 'mixed') return 10;
    if (usage === 'daily') return 8; // Most products are daily-wearable
    if (usage === 'special') return 6;
    
    return 5;
  }

  matchPersonality(product, personality) {
    const personalityMap = {
      subtle: ['Miasta', 'Kolekcja'],
      balanced: ['Kolekcja', 'Miasta'],
      standout: ['Symbole']
    };

    if (product.categories && product.categories.some(cat => personalityMap[personality]?.includes(cat))) {
      return 10;
    }
    return 5;
  }

  matchMaterials(product, materials) {
    if (materials === 'stones' && product.specs?.kamienie) return 10;
    if (materials === 'metal' && product.material === 'sterling_silver') return 10;
    if (materials === 'mixed' && product.specs?.kamienie && product.material === 'sterling_silver') return 10;
    
    return 5;
  }

  matchSize(product, size) {
    // This is a simplified matching based on product characteristics
    const weight = parseFloat(product.specs?.waga?.replace(',', '.') || '0.5');
    
    if (size === 'delicate' && weight < 0.5) return 10;
    if (size === 'medium' && weight >= 0.4 && weight <= 0.6) return 10;
    if (size === 'chunky' && weight > 0.6) return 10;
    
    return 5;
  }

  matchMeaning(product, meaning) {
    if (meaning === 'important' && product.categories?.includes('Symbole')) return 10;
    if (meaning === 'neutral' && product.categories?.includes('Miasta')) return 8;
    if (meaning === 'bonus') return 6;
    
    return 5;
  }

  matchBudget(product, priceRange) {
    const price = product.price;
    
    if (price >= priceRange[0] && price <= priceRange[1]) {
      return 10;
    }
    
    // Partial matches
    if (price < priceRange[0]) return 6; // Under budget
    if (price > priceRange[1]) return 4; // Over budget
    
    return 5;
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
      <a href="./index.html#contact" class="btn btn-primary">Zamów bransoletkę</a>
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
          <a href="./index.html" class="alternative-product">
            <img src="${product.images?.[0] || './assets/images/bracelet-hero.png'}" 
                 alt="${product.name}" 
                 class="alternative-product-image" />
            <div class="alternative-product-info">
              <div class="alternative-product-name">${product.name}</div>
              <div class="alternative-product-price">${this.formatPrice(product.price, product.currency)}</div>
            </div>
          </a>
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
document.addEventListener('DOMContentLoaded', () => {
  const state = new QuizState();
  const scorer = new ProductScorer(PRODUCTS);
  const ui = new QuizUI(state, scorer);
  
  // Make quiz available globally for debugging
  window.quiz = { state, scorer, ui };
});
