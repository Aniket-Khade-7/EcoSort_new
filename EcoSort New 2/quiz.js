import { shuffle } from "./utils.js";

export class Quiz {
  constructor(questions, onFinished) {
    this.questions = questions;
    this.onFinished = onFinished;
    this.current = 0;
    this.score = 0;
    this.answered = false;

    this.progress = document.getElementById("quizProgress");
    this.questionText = document.getElementById("questionText");
    this.optionsArea = document.getElementById("answerOptions");
    this.feedback = document.getElementById("quizFeedback");
    this.submitButton = document.getElementById("submitAnswer");
    this.nextButton = document.getElementById("nextQuestion");
    this.resultsButton = document.getElementById("resultsButton");

    var quiz = this;
    this.submitButton.addEventListener("click", function () {
      quiz.checkAnswer();
    });
    this.nextButton.addEventListener("click", function () {
      quiz.current = quiz.current + 1;
      quiz.showQuestion();
    });
    this.resultsButton.addEventListener("click", function () {
      quiz.onFinished(quiz.score, quiz.questions.length);
    });

    this.showQuestion();
  }

  showQuestion() {
    var question = this.questions[this.current];
    var quiz = this;
    this.answered = false;
    this.progress.textContent =
      "Question " + (this.current + 1) + " of " + this.questions.length;
    this.questionText.textContent = question.question;
    this.feedback.textContent = "";
    this.optionsArea.innerHTML = "";
    this.submitButton.disabled = true;
    this.submitButton.classList.remove("hidden");
    this.nextButton.classList.add("hidden");
    this.resultsButton.classList.add("hidden");

    var options = shuffle(question.options);

    for (var i = 0; i < options.length; i++) {
      var label = document.createElement("label");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quizChoice";
      radio.value = options[i];

      radio.addEventListener("change", function () {
        quiz.submitButton.disabled = false;
        var labels = quiz.optionsArea.querySelectorAll("label");
        for (var j = 0; j < labels.length; j++) {
          labels[j].classList.remove("selected");
        }
        this.parentElement.classList.add("selected");
      });

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + options[i]));
      this.optionsArea.appendChild(label);
    }
  }

  checkAnswer() {
    if (this.answered) {
      return;
    }

    var chosen = document.querySelector('input[name="quizChoice"]:checked');
    if (chosen === null) {
      return;
    }

    this.answered = true;
    var question = this.questions[this.current];

    if (chosen.value === question.answer) {
      this.score = this.score + 1;
      this.feedback.textContent = question.feedback.correct;
      chosen.parentElement.classList.add("correct");
    } else {
      this.feedback.textContent =
        question.feedback.incorrect + " Correct answer: " + question.answer;
      chosen.parentElement.classList.add("incorrect");
    }

    var radios = this.optionsArea.querySelectorAll("input");
    for (var i = 0; i < radios.length; i++) {
      radios[i].disabled = true;
      if (radios[i].value === question.answer) {
        radios[i].parentElement.classList.add("correct");
      }
    }

    this.submitButton.classList.add("hidden");

    if (this.current === this.questions.length - 1) {
      this.resultsButton.classList.remove("hidden");
    } else {
      this.nextButton.classList.remove("hidden");
    }
  }
  reset() {
    this.current = 0;
    this.score = 0;
    this.showQuestion();
  }
}
