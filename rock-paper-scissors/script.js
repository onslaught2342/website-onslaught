// script.js

// WINNING COMBINATIONS
const winConditions = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
  };
  
  function playGame(playerMove) {
    const robotChoices = ["rock", "paper", "scissors"];
    const robotMove = robotChoices[Math.floor(Math.random() * robotChoices.length)];
  
    // Animate hands
    const playerHand = document.getElementById("player-hand");
    const robotHand = document.getElementById("robot-hand");
  
    playerHand.classList.add("swing");
    robotHand.classList.add("swing");
  
    // Wait for animation to finish
    setTimeout(() => {
      playerHand.classList.remove("swing");
      robotHand.classList.remove("swing");
  
      // Show moves
      playerHand.textContent = getSymbol(playerMove);
      robotHand.textContent = getSymbol(robotMove);
  
      // Determine the result
      const result = getResult(playerMove, robotMove);
      displayResult(result, playerMove, robotMove);
    }, 1000);
  }
  
  function getSymbol(move) {
    switch (move) {
      case "rock": return "✊";
      case "paper": return "🖐️";
      case "scissors": return "✌️";
      default: return "";
    }
  }
  
  function getResult(player, robot) {
    if (player === robot) return "It's a Draw!";
    if (winConditions[player] === robot) return "You Win!";
    return "Robot Wins!";
  }
  
  function displayResult(result, playerMove, robotMove) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
      <p>${result}</p>
      <p>You played: <strong>${playerMove}</strong></p>
      <p>Robot played: <strong>${robotMove}</strong></p>
    `;
  }
  