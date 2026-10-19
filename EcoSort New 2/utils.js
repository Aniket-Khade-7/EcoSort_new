
export function showScreen(screenToShow, screens) {
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.add("hidden");
  }

  screenToShow.classList.remove("hidden");
}

export function shuffle(list) {
  var result = list.slice();

  for (var i = result.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var savedValue = result[i];
    result[i] = result[randomIndex];
    result[randomIndex] = savedValue;
  }

  return result;
}
