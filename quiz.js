const numberOfQuestions = 10;
const upperScore = 8;
const lowerScore = 5;

let allQuestions; // Hold all questions from the API
let totalQuestionsCount = Number(localStorage.getItem("totalQuestionsCount"));
let rightCount = Number(localStorage.getItem("rightCount"));
let wrongCount = Number(localStorage.getItem("wrongCount"));
let currentQuestionIndex = 0;
let score = 0;

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
  DOM_ELEMENT.totalQuestions.textContent = `Answered questions: ${totalQuestionsCount}`;
  DOM_ELEMENT.totalRight.textContent = `Right answers: ${rightCount}`;
  DOM_ELEMENT.totalWrong.textContent = `Wrong answers: ${wrongCount}`;
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
  DOM_ELEMENT.quizQuestion.textContent = `${allQuestions[currentQuestionIndex].question}`;
  DOM_ELEMENT.quizOptions.innerHTML = "";

  allQuestions[currentQuestionIndex].possibleAnswers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () => {
      checkAnswer(li, allQuestions[currentQuestionIndex].correctAnswer);

      const answers = document.querySelectorAll("li");
      answers.forEach((answer) => {
        answer.style.pointerEvents = "none";
      });

      DOM_ELEMENT.nextQuestionBtn.style.display = "flex";
    });
    DOM_ELEMENT.quizOptions.appendChild(li);
  });

  DOM_ELEMENT.nextQuestionBtn.style.display = "none";
}

function checkAnswer(li, correctAnswer) {
  if (li.textContent == correctAnswer) {
    li.classList.add("correct");
    rightCount++;
    localStorage.setItem("rightCount", rightCount);
    score++;
  } else {
    li.classList.add("wrong");
    wrongCount++;
    localStorage.setItem("wrongCount", wrongCount);
  }
  totalQuestionsCount++;
  localStorage.setItem("totalQuestionsCount", totalQuestionsCount);
}

function backToStartPage() {
  DOM_ELEMENT.startPage.style.display = "flex";
  DOM_ELEMENT.quizContainer.style.display = "none";
  DOM_ELEMENT.quizResult.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  displayTotalStats();
}

DOM_ELEMENT.startQuizBtn.addEventListener("click", () => {
  DOM_ELEMENT.startPage.style.display = "none";
  DOM_ELEMENT.quizContainer.style.display = "flex";
  displayQuiz();
});

DOM_ELEMENT.quitQuizBtn.addEventListener("click", () => {
  backToStartPage();
});

DOM_ELEMENT.nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < numberOfQuestions) {
    currentQuestionIndex === numberOfQuestions - 1
      ? (DOM_ELEMENT.nextQuestionBtn.textContent = "Show Result")
      : (DOM_ELEMENT.nextQuestionBtn.textContent = "Next Question");
    displayQuestion();
  } else {
    DOM_ELEMENT.quizContainer.style.display = "none";
    DOM_ELEMENT.quizResult.style.display = "flex";
    DOM_ELEMENT.nextQuestionBtn.textContent = "Next Question";

    if (score >= upperScore) {
      DOM_ELEMENT.quizQuestionResult.textContent = `You got ${score} out of ${numberOfQuestions}! You are a Futurama master!`;
    } else if (score >= lowerScore && score < upperScore) {
      DOM_ELEMENT.quizQuestionResult.textContent = `You got ${score} out of ${numberOfQuestions}! You are a good Futurama fan!`;
    } else if (score < lowerScore) {
      DOM_ELEMENT.quizQuestionResult.textContent = `You got ${score} out of ${numberOfQuestions}! You need to watch more of Futurama!`;
    }
  }
});

DOM_ELEMENT.startPageBtn.addEventListener("click", () => {
  backToStartPage();
});
