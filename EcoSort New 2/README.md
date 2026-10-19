# EcoSort - Beginner Version

## What is this project?
EcoSort teaches a learner how to sort waste into Recycle, Compost and Landfill bins. It uses HTML, CSS and beginner-friendly JavaScript.

## Folder structure
- `index.html` - page structure and the five screens.
- `style.css` - colours, spacing, responsive layout and feedback styles.
- `main.js` - connects the screens and manages the course flow.
- `dataLoader.js` - loads and checks `data/course.json`.
- `dragDrop.js` - creates the sorting game and handles mouse dragging.
- `quiz.js` - displays questions, checks answers and shows feedback.
- `utils.js` - small shared helper functions.
- `data/course.json` - course introduction, bins, waste items and quiz questions.

## How to run
1. Extract the ZIP file.
2. Open the `EcoSort_PDF_Beginner` folder in VS Code.
3. Open `index.html` with the VS Code Live Server extension.
4. Do not open the HTML file directly from the file system: `fetch()` needs a local web server to load the JSON file.

## Screen flow
Welcome -> Learn -> Sorting Game -> Quiz -> Results.

## Important beginner terms
- HTML creates the page structure.
- CSS controls how the page looks.
- JavaScript responds to actions and updates the page.
- JSON stores the course information separately from the code.
- `function` is a reusable set of instructions.
- `if/else` lets the program make a decision.
- `for` repeats instructions.
- `addEventListener` runs a function after an event such as a click or mouse movement.
- `import` and `export` allow JavaScript files to share code.
- `async/await` lets JavaScript wait for course data to load.
