import { loadCourse } from "./dataLoader.js";
import { showScreen } from "./utils.js";
import { SortingGame } from "./dragDrop.js";
import { Quiz } from "./quiz.js";

var screens = document.querySelectorAll(".screen");
var welcomeScreen = document.getElementById("welcomeScreen");
var learnScreen = document.getElementById("learnScreen");
var gameScreen = document.getElementById("gameScreen");
var quizScreen = document.getElementById("quizScreen");
var resultsScreen = document.getElementById("resultsScreen");

var nameInput = document.getElementById("learnerName");
var startButton = document.getElementById("startButton");
var nameHelp = document.getElementById("nameHelp");
var courseIntro = document.getElementById("courseIntro");
var learnCards = document.getElementById("learnCards");
var viewCounter = document.getElementById("viewCounter");
var learnNextButton = document.getElementById("learnNextButton");
var gameNextButton = document.getElementById("gameNextButton");

var courseData;
var learnerName = "";
var viewedBins = [];
var sortingGame;
var quiz;
var finalGameScore = 0;
var finalQuizScore = 0;

loadCourse()
  .then(function (data) {
    courseData = data;
    courseIntro.textContent = data.course.intro;
    document.title = data.course.title;
    createLearnCards();
  })
  .catch(function (error) {
    courseIntro.textContent = error.message;
  });

nameInput.addEventListener("input", function () {
  if (nameInput.value.trim().length >= 2) {
    startButton.disabled = false;
    nameHelp.textContent = "Great! You can start now.";
  } else {
    startButton.disabled = true;
    nameHelp.textContent = "Please enter at least 2 characters.";
  }
});

startButton.addEventListener("click", function () {
  learnerName = nameInput.value.trim();
  createLearnCards();
  showScreen(learnScreen, screens);
});

function createLearnCards() {
  if (!courseData) {
    return;
  }

  learnCards.innerHTML = "";
  viewedBins = [];
  updateViewCounter();
  learnNextButton.disabled = true;

  for (var i = 0; i < courseData.bins.length; i++) {
    var bin = courseData.bins[i];
    var card = document.createElement("button");
    card.className = "learn-card";
    card.innerHTML =
      "<h3>" +
      bin.name +
      "</h3><p>" +
      bin.color +
      " bin</p><p>" +
      bin.description +
      "</p><p>Click to see examples.</p>";
    card.setAttribute("data-bin-id", bin.id);

    card.addEventListener("click", function () {
      var chosenId = this.getAttribute("data-bin-id");
      var chosenBin;

      for (var j = 0; j < courseData.bins.length; j++) {
        if (courseData.bins[j].id === chosenId) {
          chosenBin = courseData.bins[j];
        }
      }

      this.innerHTML =
        "<h3>" +
        chosenBin.name +
        "</h3><p>Examples:</p><p>" +
        chosenBin.examples.join(", ") +
        "</p><p>Click to view again.</p>";

      if (viewedBins.indexOf(chosenId) === -1) {
        viewedBins.push(chosenId);
      }

      updateViewCounter();
    });

    learnCards.appendChild(card);
  }
}

function updateViewCounter() {
  viewCounter.textContent =
    "Cards viewed: " +
    viewedBins.length +
    " of " +
    (courseData ? courseData.bins.length : 3);

  if (courseData && viewedBins.length === courseData.bins.length) {
    learnNextButton.disabled = false;
  }
}

learnNextButton.addEventListener("click", function () {
  sortingGame = new SortingGame(courseData, function (score) {
    finalGameScore = score;
  });
  showScreen(gameScreen, screens);
});

gameNextButton.addEventListener("click", function () {
  if (!quiz) {
    quiz = new Quiz(courseData.quiz, showResults);
  } else {
    quiz.reset();
  }
  showScreen(quizScreen, screens);
});

function showResults(score, totalQuestions) {
  finalQuizScore = score;
  document.getElementById("resultGreeting").textContent =
    "Well done, " + learnerName + "!";
  document.getElementById("resultGameScore").textContent =
    finalGameScore + " points";
  document.getElementById("resultQuizScore").textContent =
    score + " out of " + totalQuestions;

  var quizPercent = Math.round((score / totalQuestions) * 100);
  var gameMax = courseData.items.length * 10;
  var gamePercent = Math.round((finalGameScore / gameMax) * 100);
  var totalPercent = Math.round((gamePercent + quizPercent) / 2);

  document.getElementById("resultPercent").textContent = totalPercent + "%";
  var totalCard = document.getElementById("totalResultCard");

  if (totalPercent >= courseData.course.passMark) {
    totalCard.className = "result-card pass";
    document.getElementById("resultMessage").textContent =
      "You passed! Great work.";
  } else {
    totalCard.className = "result-card retry";
    document.getElementById("resultMessage").textContent =
      "Keep practising. You can retry the quiz.";
  }

  showScreen(resultsScreen, screens);
}

document.getElementById("retryQuiz").addEventListener("click", function () {
  if (quiz) {
    quiz.reset();
  }
  showScreen(quizScreen, screens);
});

document.getElementById("restartCourse").addEventListener("click", function () {
  learnerName = "";
  finalGameScore = 0;
  finalQuizScore = 0;
  nameInput.value = "";
  startButton.disabled = true;
  nameHelp.textContent = "Please enter your name to begin.";
  viewedBins = [];
  createLearnCards();
  showScreen(welcomeScreen, screens);
});
