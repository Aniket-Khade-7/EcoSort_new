export class SortingGame {
  constructor(data, onFinished) {
    this.data = data;
    this.onFinished = onFinished;
    this.score = 0;
    this.sortedCount = 0;
    this.tries = {};
    this.activeItem = null;
    this.offsetX = 0;
    this.offsetY = 0;

    this.tray = document.getElementById("itemTray");
    this.binArea = document.getElementById("binArea");
    this.scoreOutput = document.getElementById("gameScore");
    this.countOutput = document.getElementById("sortedCount");
    this.totalOutput = document.getElementById("itemTotal");
    this.feedback = document.getElementById("gameFeedback");
    this.nextButton = document.getElementById("gameNextButton");

    this.render();
  }
  render() {
    var game = this;
    this.tray.innerHTML = "";
    this.binArea.innerHTML = "";
    this.nextButton.classList.add("hidden");

    this.score = 0;
    this.sortedCount = 0;
    this.tries = {};
    this.scoreOutput.textContent = "0";
    this.countOutput.textContent = "0";
    this.totalOutput.textContent = this.data.items.length;

    for (var i = 0; i < this.data.items.length; i++) {
      var itemData = this.data.items[i];
      var item = document.createElement("button");
      item.className = "waste-item";
      item.textContent = itemData.name;
      item.setAttribute("data-item-id", itemData.id);
      item.setAttribute("data-correct-bin", itemData.bin);
      item.addEventListener("mousedown", function (event) {
        game.startDrag(event);
      });
      this.tray.appendChild(item);
    }

    for (var j = 0; j < this.data.bins.length; j++) {
      var binData = this.data.bins[j];
      var bin = document.createElement("div");
      bin.className = "bin " + binData.id;
      bin.setAttribute("data-bin-id", binData.id);
      bin.innerHTML =
        "<h3>" + binData.name + "</h3><p>" + binData.color + " bin</p>";
      this.binArea.appendChild(bin);
    }

    this.feedback.textContent =
      "Hold an item with your mouse and move it to a bin.";
  }

  startDrag(event) {
    if (event.currentTarget.getAttribute("data-sorted") === "yes") {
      return;
    }

    this.activeItem = event.currentTarget;
    var position = this.activeItem.getBoundingClientRect();
    this.offsetX = event.clientX - position.left;
    this.offsetY = event.clientY - position.top;

    this.activeItem.style.width = position.width + "px";
    this.activeItem.style.left = position.left + "px";
    this.activeItem.style.top = position.top + "px";
    this.activeItem.classList.add("dragging");

    var game = this;
    this.moveFunction = function (moveEvent) {
      game.moveDrag(moveEvent);
    };
    this.upFunction = function (upEvent) {
      game.stopDrag(upEvent);
    };

    document.addEventListener("mousemove", this.moveFunction);
    document.addEventListener("mouseup", this.upFunction);
  }

  moveDrag(event) {
    if (this.activeItem === null) {
      return;
    }

    this.activeItem.style.left = event.clientX - this.offsetX + "px";
    this.activeItem.style.top = event.clientY - this.offsetY + "px";

    var bins = document.querySelectorAll(".bin");
    for (var i = 0; i < bins.length; i++) {
      var position = bins[i].getBoundingClientRect();
      var isOverBin =
        event.clientX >= position.left &&
        event.clientX <= position.right &&
        event.clientY >= position.top &&
        event.clientY <= position.bottom;

      bins[i].classList.toggle("highlight", isOverBin);
    }
  }

  stopDrag(event) {
    if (this.activeItem === null) {
      return;
    }

    var item = this.activeItem;
    var droppedBin = null;
    var bins = document.querySelectorAll(".bin");

    for (var i = 0; i < bins.length; i++) {
      var position = bins[i].getBoundingClientRect();
      if (
        event.clientX >= position.left &&
        event.clientX <= position.right &&
        event.clientY >= position.top &&
        event.clientY <= position.bottom
      ) {
        droppedBin = bins[i];
      }
      bins[i].classList.remove("highlight");
    }

    item.classList.remove("dragging");
    item.style.left = "";
    item.style.top = "";
    item.style.width = "";

    document.removeEventListener("mousemove", this.moveFunction);
    document.removeEventListener("mouseup", this.upFunction);

    if (droppedBin === null) {
      this.feedback.textContent = "Drop the item inside one of the bins.";
    } else {
      this.checkAnswer(item, droppedBin);
    }

    this.activeItem = null;
  }

  checkAnswer(item, bin) {
    var itemId = item.getAttribute("data-item-id");
    var correctBin = item.getAttribute("data-correct-bin");
    var chosenBin = bin.getAttribute("data-bin-id");

    if (!this.tries[itemId]) {
      this.tries[itemId] = 0;
    }
    this.tries[itemId] = this.tries[itemId] + 1;

    if (correctBin === chosenBin) {
      if (this.tries[itemId] === 1) {
        this.score = this.score + 10;
      } else {
        this.score = this.score + 5;
      }

      this.sortedCount = this.sortedCount + 1;
      this.scoreOutput.textContent = this.score;
      this.countOutput.textContent = this.sortedCount;

      var sortedText = document.createElement("p");
      sortedText.textContent = "✓ " + item.textContent;
      bin.appendChild(sortedText);
      item.setAttribute("data-sorted", "yes");
      item.remove();

      this.feedback.textContent =
        "Correct! +" + (this.tries[itemId] === 1 ? "10" : "5") + " points.";
    } else {
      var hint = "Not this bin. Try again.";
      for (var i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].id === itemId) {
          hint = this.data.items[i].hint;
        }
      }
      this.feedback.textContent = "Not this bin. Hint: " + hint;
    }

    if (this.sortedCount === this.data.items.length) {
      this.feedback.textContent = "Great job! You sorted all the items.";
      this.nextButton.classList.remove("hidden");
      this.onFinished(this.score);
    }
  }
}
