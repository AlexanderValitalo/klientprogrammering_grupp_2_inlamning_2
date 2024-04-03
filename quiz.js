const numberOfQuestions = 10; //number of questions in the quiz
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
    localStorage.setItem(
      "allQuestions",
      JSON.stringify(await API.getQuestions())
    );
  }

  allQuestions = await JSON.parse(localStorage.getItem("allQuestions"));

  displayTotalStats();
})();

// display the stats on the start page
function displayTotalStats() {
  DOM_ELEMENT.totalQuestions.textContent = `Answered questions: ${totalQuestionsCount}`;
  DOM_ELEMENT.totalRight.textContent = `Right answers: ${rightCount}`;
  DOM_ELEMENT.totalWrong.textContent = `Wrong answers: ${wrongCount}`;
}

// randomize questions and display them
function displayQuiz() {
  randomizeQuestions();
  displayQuestion();
}

//shuffle the array of questions in random order
function randomizeQuestions() {
  let currentIndex = allQuestions.length;

  // start from the last element to the first element in the allQuestions array
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

//display question and answer options
function displayQuestion() {
  DOM_ELEMENT.quizQuestion.textContent = `${allQuestions[currentQuestionIndex].question}`;
  DOM_ELEMENT.quizOptions.innerHTML = "";

  // display each possible answer as a list element and make them clickable
  allQuestions[currentQuestionIndex].possibleAnswers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () => {
      checkAnswer(li, allQuestions[currentQuestionIndex].correctAnswer);

      const answers = document.querySelectorAll("li");
      // when user clicks on an answer we make all answers unclickable
      answers.forEach((answer) => {
        answer.style.pointerEvents = "none";
      });

      DOM_ELEMENT.nextQuestionBtn.style.display = "flex";
    });
    DOM_ELEMENT.quizOptions.appendChild(li);
  });

  DOM_ELEMENT.nextQuestionBtn.style.display = "none";
}

//compare the clicked answer with the correct answer
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

// go back to start page and reset variables for the quiz
function backToStartPage() {
  DOM_ELEMENT.startPage.style.display = "flex";
  DOM_ELEMENT.quizContainer.style.display = "none";
  DOM_ELEMENT.quizResult.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  displayTotalStats();
}

//start the quiz when "Start quiz" button is clicked
DOM_ELEMENT.startQuizBtn.addEventListener("click", () => {
  DOM_ELEMENT.startPage.style.display = "none";
  DOM_ELEMENT.quizContainer.style.display = "flex";
  displayQuiz();
});

//"End quiz" button redirects back to start page
DOM_ELEMENT.quitQuizBtn.addEventListener("click", () => {
  backToStartPage();
});

// display next question or the result page
DOM_ELEMENT.nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;

  // display next question until last question is answered
  if (currentQuestionIndex < numberOfQuestions) {
    currentQuestionIndex === numberOfQuestions - 1
      ? (DOM_ELEMENT.nextQuestionBtn.textContent = "Show Result")
      : (DOM_ELEMENT.nextQuestionBtn.textContent = "Next Question");
    displayQuestion();
  }
  // display result page
  else {
    DOM_ELEMENT.quizContainer.style.display = "none";
    DOM_ELEMENT.quizResult.style.display = "flex";
    DOM_ELEMENT.nextQuestionBtn.textContent = "Next Question";

    // display different result messages depending on the result
    if (score >= upperScore) {
      DOM_ELEMENT.quizQuestionResult.innerHTML = `You got ${score} out of ${numberOfQuestions}!<br> You are a Futurama master!`;
    } else if (score >= lowerScore && score < upperScore) {
      DOM_ELEMENT.quizQuestionResult.innerHTML = `You got ${score} out of ${numberOfQuestions}!<br> You are a good Futurama fan!`;
    } else if (score < lowerScore) {
      DOM_ELEMENT.quizQuestionResult.innerHTML = `You got ${score} out of ${numberOfQuestions}!<br> You need to watch more of Futurama!`;
    }
  }
});

//"Back to start page" button redirects to start page
DOM_ELEMENT.startPageBtn.addEventListener("click", () => {
  backToStartPage();
});
