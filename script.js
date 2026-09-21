
let currentPlayer = "";
let score = 0;
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 10;
const maxQuestions = 5;

// SAMPLE QUESTIONS
const questions = [
  { q: "What is the capital of Indiana?", options: ["Indianapolis", "Fort Wayne", "Evansville", "Carmel"], answer: 0 },
  { q: "Which property changes the background color in CSS?", options: ["color", "bgcolor", "background-color", "background"], answer: 2 },
  { q: "What symbol indicates an ID selector in CSS?", options: [".", "#", "*", ">"], answer: 1 },
  { q: "Which keyword declares a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], answer: 3 },
  { q: "What function sets a timer in JS?", options: ["setTimeout", "setInterval", "setTimer", "timeOut"], answer: 1 }
];


const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const screenLobby = document.getElementById('screen-lobby');
const screenGameplay = document.getElementById('screen-gameplay');
const screenLeaderboard = document.getElementById('screen-leaderboard');
const timeDisplay = document.getElementById('time-display');
const scoreDisplay = document.getElementById('score-display');
const questionNumber = document.getElementById('question-number');
const questionBox = document.getElementById('question-box');
const answerBtns = document.querySelectorAll('.answer-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const finalScore = document.getElementById('final-score');


loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); 
  currentPlayer = usernameInput.value.trim();
  
  if (currentPlayer) {
    localStorage.setItem('currentPlayer', currentPlayer);
    switchScreen(screenLobby, screenGameplay);
    startGame();
  }
});

playAgainBtn.addEventListener('click', function() {
  switchScreen(screenLeaderboard, screenLobby);
  usernameInput.value = "";
});

function switchScreen(oldScreen, newScreen) {
  oldScreen.classList.remove('active');
  oldScreen.classList.add('hidden');
  newScreen.classList.remove('hidden');
  newScreen.classList.add('active');
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
      questionBox.textContent = "Time's up!";
      
      setTimeout(() => {
        handleAnswer(-1, currentQ.answer); 
      }, 1000);
    }
  }, 1000);
}

function handleAnswer(selectedIndex, correctIndex) {
  clearInterval(timerInterval); 
  
  if (selectedIndex === correctIndex) {
    score += 100 + (timeLeft * 10);
  }
  
  scoreDisplay.textContent = score;
  currentQuestionIndex++;
  
  setTimeout(loadQuestion, 500); 
}

function endGame() {
  switchScreen(screenGameplay, screenLeaderboard);
  finalScore.textContent = score;
}
