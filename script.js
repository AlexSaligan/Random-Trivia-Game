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

  let globalScores = [
    { name: "Sarah Jenkins", score: 1450 },
    { name: "Michael Miller", score: 1320 },
    { name: "David Ross", score: 1210 },
    { name: "Emily Davis", score: 1150 },
    { name: "James Wilson", score: 1080 },
    { name: "Jessica Taylor", score: 990 },
    { name: "Daniel Anderson", score: 920 },
    { name: "Amanda Martinez", score: 850 },
    { name: "Robert Thomas", score: 800 },
    { name: "Ashley Jackson", score: 750 }
  ];

  const questions = [
    { q: "Which planet in our solar system has the most confirmed moons?", options: ["Jupiter", "Saturn", "Neptune", "Uranus"], answer: 1 },
    { q: "What is the smallest ocean in the world?", options: ["Indian Ocean", "Southern Ocean", "Arctic Ocean", "Atlantic Ocean"], answer: 2 },
    { q: "Who wrote the dystopian novel '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"], answer: 0 },
    { q: "Which element on the periodic table has the atomic number 1?", options: ["Helium", "Hydrogen", "Carbon", "Oxygen"], answer: 1 },
    { q: "In which country can you visit the ancient landmark Machu Picchu?", options: ["Chile", "Colombia", "Peru", "Brazil"], answer: 2 },
    { q: "How many bones are in the adult human body?", options: ["186", "206", "226", "246"], answer: 1 },
    { q: "Which country gifted the Statue of Liberty to the United States?", options: ["Great Britain", "France", "Spain", "Germany"], answer: 1 },
    { q: "What is the capital city of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answer: 3 },
    { q: "Which movie won the very first Academy Award for Best Animated Feature in 2002?", options: ["Toy Story", "Shrek", "Finding Nemo", "Monsters, Inc."], answer: 1 },
    { q: "What is the chemical formula for table salt?", options: ["KCl", "NaCl", "NaOH", "CO2"], answer: 1 },
    { q: "Which famous artist painted 'The Starry Night'?", options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"], answer: 0 },
    { q: "Which European city hosted the 2012 Summer Olympic Games?", options: ["Beijing", "London", "Rio de Janeiro", "Athens"], answer: 1 },
    { q: "What is the official currency used in the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc"], answer: 2 },
    { q: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Gallbladder"], answer: 2 },
    { q: "What is the highest mountain peak in North America?", options: ["Mount Rainier", "Denali", "Mount Whitney", "Mount Elbert"], answer: 1 }
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

    const qObj = questions[currentQuestionIndex];
    document.getElementById('question-box').textContent = qObj.q;

    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach((btn) => {
      btn.classList.remove('disabled', 'correct', 'incorrect');
      btn.disabled = false;
      
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    const freshBtns = document.querySelectorAll('.answer-btn');
    freshBtns.forEach((btn, index) => {
      btn.textContent = qObj.options[index];
      btn.addEventListener('click', () => {
        handleAnswer(index, qObj.answer);
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
    
    const qObj = questions[currentQuestionIndex];
    freshBtns[qObj.answer].classList.add('correct');

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
    saveScore();
    renderLeaderboard();
    document.getElementById('final-score').textContent = currentScore;
    updateStatsOnGameEnd(currentScore);
    switchScreen('screen-leaderboard');
  }

  function getStoredLeaderboard() {
    const data = localStorage.getItem('trivia_leaderboard');
    if (data) {
      try {
        globalScores = JSON.parse(data);
      } catch (e) {
        // fallback
      }
    }
    return globalScores;
  }

  function saveScore() {
    let lb = getStoredLeaderboard();
    if (currentUser) {
      lb.push({ name: currentUser, score: currentScore });
    }
    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 10);
    globalScores = lb;
    localStorage.setItem('trivia_leaderboard', JSON.stringify(lb));

    let totalGames = parseInt(localStorage.getItem('totalGames') || '0', 10);
    localStorage.setItem('totalGames', totalGames + 1);
  }

  function renderLeaderboard() {
    const lb = getStoredLeaderboard();
    
    const p1 = document.getElementById('podium-1-name');
    const p2 = document.getElementById('podium-2-name');
    const p3 = document.getElementById('podium-3-name');

    if (p1) p1.textContent = lb[0] ? `${lb[0].name}\n(${lb[0].score} pts)` : '-';
    if (p2) p2.textContent = lb[1] ? `${lb[1].name}\n(${lb[1].score} pts)` : '-';
    if (p3) p3.textContent = lb[2] ? `${lb[2].name}\n(${lb[2].score} pts)` : '-';

    const listEl = document.getElementById('leaderboard-list');
    if (listEl) {
      listEl.innerHTML = '';
      for (let i = 3; i < 10; i++) {
        const li = document.createElement('li');
        if (lb[i]) {
          li.textContent = `${lb[i].name} - ${lb[i].score} pts`;
        } else {
          li.textContent = '---';
        }
        listEl.appendChild(li);
      }
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

  renderLeaderboard();
  renderStatsUI();
});
