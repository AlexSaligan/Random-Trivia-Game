document.addEventListener('DOMContentLoaded', () => {
  const screens = document.querySelectorAll('.screen');
  const navButtons = document.querySelectorAll('.nav-btn');

  function switchScreen(targetId) {
    screens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(targetId);
    if (targetScreen) {
      targetScreen.classList.remove('hidden');
      targetScreen.classList.add('active');
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchScreen(target);
    });
  });

  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('screen-lobby');
    });
  }

  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');

  let currentUser = '';
  let currentScore = 0;
  let currentQuestionIndex = 0;
  let timerInterval = null;
  let timeLeft = 15;

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: 1
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      answer: 3
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Silver", "Iron"],
      answer: 1
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"],
      answer: 2
    },
    {
      question: "What is the speed of light approximately?",
      options: ["300,000 km/s", "150,000 km/s", "3,000 km/s", "30,000 km/s"],
      answer: 0
    },
    {
      question: "Which country is home to the kangaroo?",
      options: ["New Zealand", "South Africa", "Australia", "Brazil"],
      answer: 2
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      answer: 2
    },
    {
      question: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      answer: 2
    },
    {
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Pepper", "Onion"],
      answer: 1
    },
    {
      question: "Which musical instrument has 88 keys?",
      options: ["Guitar", "Violin", "Piano", "Flute"],
      answer: 2
    },
    {
      question: "What is the tallest mammal in the world?",
      options: ["Elephant", "Giraffe", "Blue Whale", "Horse"],
      answer: 1
    },
    {
      question: "In which year did the Titanic sink?",
      options: ["1912", "1905", "1920", "1898"],
      answer: 0
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Ag", "Fe", "Au", "Pb"],
      answer: 2
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      answer: 2
    }
  ];

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = usernameInput.value.trim();
      formError.textContent = '';
      formSuccess.textContent = '';

      if (val.length < 2) {
        formError.textContent = 'Nickname must be at least 2 characters long.';
        usernameInput.focus();
        return;
      }
      if (val.length > 15) {
        formError.textContent = 'Nickname cannot exceed 15 characters.';
        usernameInput.focus();
        return;
      }

      currentUser = val;
      formSuccess.textContent = `Welcome, ${currentUser}! Starting game...`;
      
      updateStatsOnGameStart();

      setTimeout(() => {
        formSuccess.textContent = '';
        usernameInput.value = '';
        startGame();
      }, 1000);
    });
  }

  function startGame() {
    currentScore = 0;
    currentQuestionIndex = 0;
    document.getElementById('score-display').textContent = currentScore;
    document.getElementById('total-questions').textContent = questions.length;
    switchScreen('screen-gameplay');
    loadQuestion();
  }

  function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
      endGame();
      return;
    }

    clearInterval(timerInterval);
    timeLeft = 15;
    document.getElementById('time-display').textContent = timeLeft;
    document.getElementById('question-number').textContent = currentQuestionIndex + 1;

    const q = questions[currentQuestionIndex];
    document.getElementById('question-box').textContent = q.question;

    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach((btn) => {
      btn.classList.remove('disabled', 'correct', 'incorrect');
      btn.disabled = false;
      
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    const freshBtns = document.querySelectorAll('.answer-btn');
    freshBtns.forEach((btn, index) => {
      btn.textContent = q.options[index];
      btn.addEventListener('click', () => {
        handleAnswer(index, q.answer);
      });
    });

    startTimer();
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('time-display').textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function handleTimeout() {
    const freshBtns = document.querySelectorAll('.answer-btn');
    freshBtns.forEach(b => b.classList.add('disabled'));
    
    const q = questions[currentQuestionIndex];
    freshBtns[q.answer].classList.add('correct');

    setTimeout(() => {
      currentQuestionIndex++;
      loadQuestion();
    }, 1500);
  }

  function handleAnswer(selectedIndex, correctIndex) {
    clearInterval(timerInterval);
    const freshBtns = document.querySelectorAll('.answer-btn');
    freshBtns.forEach(b => b.classList.add('disabled'));

    if (selectedIndex === correctIndex) {
      freshBtns[selectedIndex].classList.add('correct');
      let basePts = 100;
      let bonusPts = 0;
      if (timeLeft >= 11) bonusPts = 50;
      else if (timeLeft >= 6) bonusPts = 25;
      
      currentScore += (basePts + bonusPts);
      document.getElementById('score-display').textContent = currentScore;
    } else {
      freshBtns[selectedIndex].classList.add('incorrect');
      freshBtns[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
      currentQuestionIndex++;
      loadQuestion();
    }, 1500);
  }

  function endGame() {
    clearInterval(timerInterval);
    document.getElementById('final-score').textContent = currentScore;
    
    saveGameResult(currentUser, currentScore);
    updateLeaderboardUI();
    updateStatsOnGameEnd(currentScore);

    switchScreen('screen-leaderboard');
  }

  function getStoredLeaderboard() {
    const data = localStorage.getItem('trivia_leaderboard');
    return data ? JSON.parse(data) : [];
  }

  function saveGameResult(name, score) {
    let lb = getStoredLeaderboard();
    lb.push({ name, score, date: new Date().toISOString() });
    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 10);
    localStorage.setItem('trivia_leaderboard', JSON.stringify(lb));
  }

  function updateLeaderboardUI() {
    const lb = getStoredLeaderboard();
    
    const p1Name = document.getElementById('podium-1-name');
    const p2Name = document.getElementById('podium-2-name');
    const p3Name = document.getElementById('podium-3-name');

    p1Name.textContent = lb[0] ? `${lb[0].name}\n(${lb[0].score} pts)` : '-';
    p2Name.textContent = lb[1] ? `${lb[1].name}\n(${lb[1].score} pts)` : '-';
    p3Name.textContent = lb[2] ? `${lb[2].name}\n(${lb[2].score} pts)` : '-';

    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = '';
    for (let i = 3; i < lb.length; i++) {
      const li = document.createElement('li');
      li.textContent = `${lb[i].name} - ${lb[i].score} pts`;
      listEl.appendChild(li);
    }
  }

  function updateStatsOnGameStart() {
    let stats = JSON.parse(localStorage.getItem('trivia_stats')) || { gamesPlayed: 0, highScore: 0 };
    stats.gamesPlayed++;
    localStorage.setItem('trivia_stats', JSON.stringify(stats));
    renderStatsUI();
  }

  function updateStatsOnGameEnd(finalScore) {
    let stats = JSON.parse(localStorage.getItem('trivia_stats')) || { gamesPlayed: 1, highScore: 0 };
    if (finalScore > stats.highScore) {
      stats.highScore = finalScore;
    }
    localStorage.setItem('trivia_stats', JSON.stringify(stats));
    renderStatsUI();
  }

  function renderStatsUI() {
    let stats = JSON.parse(localStorage.getItem('trivia_stats')) || { gamesPlayed: 0, highScore: 0 };
    document.getElementById('stat-games').textContent = stats.gamesPlayed;
    document.getElementById('stat-high-score').textContent = stats.highScore;
  }

  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      switchScreen('screen-lobby');
    });
  }

  updateLeaderboardUI();
  renderStatsUI();
});
