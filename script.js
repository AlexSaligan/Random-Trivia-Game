
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const screenLobby = document.getElementById('screen-lobby');
const gameplayScreen = document.getElementById('screen-gameplay');
const timeDisplay = document.getElementById('time-display');


let timeLeft = 10;
let timerInterval;
let score = 0;


loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); 
  
  const playerName = usernameInput.value.trim();
  
  if (playerName) {
    // Save name
    localStorage.setItem('currentPlayer', playerName);
    
    // Switch screens
    screenLobby.classList.remove('active');
    screenLobby.classList.add('hidden');
    gameplayScreen.classList.remove('hidden');
    gameplayScreen.classList.add('active');
    
    // Start the timer
    startTimer();
  }
});

// Timer stuff
function startTimer() {
  timeLeft = 10;
  timeDisplay.textContent = timeLeft;
  
  // Count down :)
  timerInterval = setInterval(function() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! 0 points for this round.");
    }
  }, 1000);
}
