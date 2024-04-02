const numberOfQuestions = 10;

let allQuestions; // Hold all questions from the API
let totalQuestionsCount = localStorage.getItem("totalQuestionsCount");
let totalRight = localStorage.getItem("totalRight");
let totalWrong = localStorage.getItem("totalWrong");
let currentQuestionIndex = 0;
let score = 0;

if (totalQuestionsCount === null) {
  totalQuestionsCount = 0;
  totalRight = 0;
  totalWrong = 0;
}

// If there are no questions stored locally we GET the questions
// from the API (https://da-demo.github.io/api/futurama/questions) and save them in local storage.$
(async () => {
  if (localStorage.getItem("allQuestions") === null) {
    localStorage.setItem("allQuestions", JSON.stringify(await API.getQuestions()));
  }

  allQuestions = await JSON.parse(localStorage.getItem("allQuestions"));

  displayTotalStats();
})();

function displayTotalStats() {
  DOM_ELEMENT.totalQuestions.innerText = `Answered questions: ${totalQuestionsCount}`;
  DOM_ELEMENT.totalRight.innerText = `Right answers: ${totalRight}`;
  DOM_ELEMENT.totalWrong.innerText = `Wrong answers: ${totalWrong}`;
}

function displayQuiz() {
  randomizeQuestions();
  displayQuestion();
}

function randomizeQuestions() {
  let currentIndex = allQuestions.length;

  // start from the last element to the first element
  // the randomized index element swaps place with the current index element
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [allQuestions[currentIndex], allQuestions[randomIndex]] = [
      allQuestions[randomIndex],
      allQuestions[currentIndex],
    ];
  }
}

function displayQuestion() {
  /************************************************************************************************* */
}

function backToStartPage() {
  DOM_ELEMENT.startPage.style.display = "flex";
  DOM_ELEMENT.quizContainer.style.display = "none";
  DOM_ELEMENT.quizResult.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
}

DOM_ELEMENT.startQuizBtn.addEventListener("click", () => {
  DOM_ELEMENT.startPage.style.display = "none";
  DOM_ELEMENT.quizContainer.style.display = "flex";
  displayQuiz();
});

DOM_ELEMENT.quitQuizBtn.addEventListener("click", () => {
  backToStartPage();
});
