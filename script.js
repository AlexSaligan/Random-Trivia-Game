let currentPlayer = "";
let score = 0;
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 10;

const questions = [
  { q: "Which planet in our solar system is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: 2 },
  { q: "Who painted the famous masterpiece, the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: 2 },
  { q: "In what year did the Titanic sink in the Atlantic Ocean?", options: ["1905", "1912", "1920", "1931"], answer: 1 },
  { q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Quartz"], answer: 2 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  { q: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1 },
  { q: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Fe", "Hg"], answer: 0 },
  { q: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "Which animal is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: 1 },
  { q: "Who wrote the play 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: 1 },
  { q: "What is the smallest country in the world by land area?", options: ["Monaco", "Vatican City", "Malta", "San Marino"], answer: 1 },
  { q: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: 2 },
  { q: "How many keys are on a standard acoustic piano?", options: ["66", "76", "88", "92"], answer: 2 },
  { q: "What is the official currency of Japan?", options: ["Yuan", "Won", "Yen", "Baht"], answer: 2 }
];

const maxQuestions = questions.length;

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const screenLobby = document.getElementById("screen-lobby");
const screenGameplay = document.getElementById("screen-gameplay");
const screenLeaderboard = document.getElementById("screen-leaderboard");
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

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();
  currentPlayer = usernameInput.value.trim();
  
  if (currentPlayer) {
    switchScreen("screen-gameplay");
    startGame();
  }
});

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", function() {
    switchScreen("screen-lobby");
    usernameInput.value = "";
  });
}

function switchScreen(screenId) {
  [screenLobby, screenGameplay, screenLeaderboard].forEach(screen => {
    if (screen) {
      screen.classList.remove("active");
      screen.classList.add("hidden");
    }
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("active");
  }
}

function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  scoreDisplay.textContent = score;
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
    btn.onclick = function() {
      handleAnswer(index, currentQ.answer);
    };
  });

  timeLeft = 10;
  timeDisplay.textContent = timeLeft;
  clearInterval(timerInterval);

  timerInterval = setInterval(function() {
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
  setTimeout(loadQuestion, 2000);
}

function endGame() {
  document.getElementById("final-score").textContent = score;
  switchScreen("screen-leaderboard");
}
