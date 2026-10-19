export async function loadCourse() {
  var response = await fetch("./data/course.json");

  if (!response.ok) {
    throw new Error(
      "Could not load course.json. Run the project with Live Server.",
    );
  }

  var data = await response.json();

  if (!data.course || !data.bins || !data.items || !data.quiz) {
    throw new Error("Some course information is missing in course.json.");
  }

  return data;
}
