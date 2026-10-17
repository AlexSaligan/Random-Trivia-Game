let currentPlayer = "";
let score = 0;
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 10;

// bot scores 
let globalScores = [
  { name: "Sarah Jenkins", score: 1450 + Math.floor(Math.random() * 51) - 25 },
  { name: "Michael Miller", score: 1320 + Math.floor(Math.random() * 51) - 25 },
  { name: "David Ross", score: 1210 + Math.floor(Math.random() * 51) - 25 },
  { name: "Emily Davis", score: 1150 + Math.floor(Math.random() * 51) - 25 },
  { name: "James Wilson", score: 1080 + Math.floor(Math.random() * 51) - 25 },
  { name: "Jessica Taylor", score: 990 + Math.floor(Math.random() * 51) - 25 },
  { name: "Daniel Anderson", score: 920 + Math.floor(Math.random() * 51) - 25 },
  { name: "Amanda Martinez", score: 850 + Math.floor(Math.random() * 51) - 25 },
  { name: "Robert Thomas", score: 800 + Math.floor(Math.random() * 51) - 25 },
  { name: "Ashley Jackson", score: 750 + Math.floor(Math.random() * 51) - 25 }
];
globalScores.sort((a, b) => b.score - a.score);

// QUESTIONS
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

const maxQuestions = questions.length;

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const formError = document.getElementById("form-error");
const formSuccess = document.getElementById("form-success");

const timeDisplay = document.getElementById("time-display");
const scoreDisplay = document.getElementById("score-display");
const questionNumber = document.getElementById("question-number");
const totalQuestionsDisplay = document.getElementById("total-questions");
const questionBox = document.getElementById("question-box");
const answerBtns = document.querySelectorAll(".answer-btn");
const playAgainBtn = document.getElementById("play-again-btn");

if (totalQuestionsDisplay) {
  totalQuestionsDisplay.textContent = maxQuestions;
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const targetId = e.currentTarget.getAttribute("data-target");
    switchScreen(targetId);
    if (targetId === "screen-stats") renderStats();
    if (targetId === "screen-leaderboard") renderLeaderboard();
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = usernameInput.value.trim();

  if (value.length < 2) {
    if (formError) formError.textContent = "Please enter a nickname at least 2 characters long.";
    if (formSuccess) formSuccess.textContent = "";
    usernameInput.focus();
  } else {
    if (formError) formError.textContent = "";
    if (formSuccess) formSuccess.textContent = `Welcome, ${value}! Starting game...`;
    currentPlayer = value;

    setTimeout(() => {
      if (formSuccess) formSuccess.textContent = "";
      startGame();
    }, 800);
  }
});

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    switchScreen("screen-lobby");
    usernameInput.value = "";
  });
}

renderLeaderboard();

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
    targetScreen.classList.add("active");
  }
}

function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  scoreDisplay.textContent = score;
  switchScreen("screen-gameplay");
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= maxQuestions) {
    return endGame();
  }
  
  answerBtns.forEach(btn => {
    btn.classList.remove("correct", "incorrect", "disabled");
  });

  const currentQ = questions[currentQuestionIndex];
  questionBox.textContent = currentQ.q;
  questionNumber.textContent = currentQuestionIndex + 1;
  
  answerBtns.forEach((btn, index) => {
    btn.textContent = currentQ.options[index];
    btn.onclick = () => handleAnswer(index, currentQ.answer);
  });
  
  timeLeft = 10;
  timeDisplay.textContent = timeLeft;
  clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(-1, currentQ.answer); 
    }
  }, 1000);
}

function handleAnswer(selectedIndex, correctIndex) {
  clearInterval(timerInterval);
  
  if (selectedIndex === correctIndex) {
    score += 100 + (timeLeft * 10);
  }
  
  scoreDisplay.textContent = score;

  answerBtns.forEach((btn, index) => {
    btn.classList.add("disabled");

    if (index === correctIndex) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("incorrect");
    }
  });

  currentQuestionIndex++;
  setTimeout(loadQuestion, 1000); 
}

function endGame() {
  saveScore();
  renderLeaderboard();
  document.getElementById("final-score").textContent = score;
  switchScreen("screen-leaderboard");
}

function saveScore() {
  globalScores.push({ name: currentPlayer, score: score });
  globalScores.sort((a, b) => b.score - a.score);
  globalScores = globalScores.slice(0, 10);

  let totalGames = parseInt(localStorage.getItem("totalGames") || "0", 10);
  localStorage.setItem("totalGames", totalGames + 1);

  let personalHigh = parseInt(localStorage.getItem("personalHighScore") || "0", 10);
  if (score > personalHigh) {
    localStorage.setItem("personalHighScore", score);
  }
}

function renderLeaderboard() {
  document.getElementById("podium-1-name").textContent = globalScores[0] ? `${globalScores[0].name}\n(${globalScores[0].score} pts)` : "-";
  document.getElementById("podium-2-name").textContent = globalScores[1] ? `${globalScores[1].name}\n(${globalScores[1].score} pts)` : "-";
  document.getElementById("podium-3-name").textContent = globalScores[2] ? `${globalScores[2].name}\n(${globalScores[2].score} pts)` : "-";

  const listEl = document.getElementById("leaderboard-list");
  if (listEl) {
    listEl.innerHTML = "";
    for (let i = 3; i < 10; i++) {
      const li = document.createElement("li");
      if (globalScores[i]) {
        li.textContent = `${globalScores[i].name} - ${globalScores[i].score} pts`;
      } else {
        li.textContent = "---";
      }
      listEl.appendChild(li);
    }
  }
}

function renderStats() {
  const totalGames = localStorage.getItem("totalGames") || "0";
  const personalHigh = localStorage.getItem("personalHighScore") || "0";

  document.getElementById("stat-games").textContent = totalGames;
  document.getElementById("stat-high-score").textContent = personalHigh;
}
