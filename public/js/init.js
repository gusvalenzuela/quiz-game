const questions = [];
const questionCategories = [];

const scriptTag = document.querySelector(`#questions-script`);
const navScoreDisplay = document.querySelector(`#hi-scr-display`);
const mainContainer = document.querySelector(`#container-col`);
const quizTimeDisplay = document.querySelector(`#time-display`);
const brandLink = document.querySelector(`#brand-link`);
const highScoreLink = document.querySelector(`#high-scores`);
const answerGroup = document.querySelector(`#answer-group`);
const gradeDisplay = document.querySelector(`#grade-display`);
const centerDisplay = document.querySelector(`#center-display`);
const penDisplay = document.querySelector(`#penalty-display`);
const playBtnCat = document.querySelector(`#play-button-cat`);
const playBtnDog = document.querySelector(`#play-button-dog`);
const playBtnSalmon = document.querySelector(`#play-button-salmon`);
const navBar = document.querySelector(`#navbar`);
const categoryName = document.querySelector(`#category-name`);
const qCountDisplay = document.querySelector(`#question-count`);
const quizOptionsDiv = document.querySelector(`#quiz-options-div`);
const loadingScreen = document.querySelector(`.loading-screen`);
const quizCategoryDiv = document.querySelector(`#quiz-category-div`);
const quizDifficultyDiv = document.querySelector(`#quiz-difficulty-div`);
const playButtonDiv = document.querySelector(`#play-button-div`);
const quizOptionsForm = document.querySelector(`#quiz-options-form`);
// const closeBtn = document.querySelector(`#close-btn`)
const questionText = document.querySelector(`#question-text`);
const input = document.createElement(`input`);
const button = document.createElement(`button`);

let qCount = 0;
// var timesPlayed = 0     // to show on navBar, maybe; it's classified
let timer = 255;
let timeElapsed = 0;
let timePenalty = 0;
let correctCount = 0;
let incorrectCount = 0;
let score = timer;
let currentSet = [];
let interval;
let userAnswer,
  correct,
  hiScore,
  highScoreDiv,
  userInput,
  answerBtns,
  q,
  t,
  storedScores,
  storedInitials,
  currentRightSound,
  currentWrongSound;
let submit = 0;
let rightAnswerSound = new Audio(currentRightSound);
let wrongAnswerSound = new Audio(currentWrongSound);
// object for current and future user data
var user = {
  name: "",
  initials: "",
  scores: [],
};
init();
function init() {
  $(`.play-screen`).hide();
  $(`.selection-screen`).hide();
  $(loadingScreen).html(`<h1 style="color: white;">LOADING CATEGORIES...</h1>`);
  getTriviaCategories();
  
}

function getTriviaCategories() {
  $.ajax({
    async: true,
    url: `https://opentdb.com/api_category.php`,
    method: `GET`,
  }).then((catRes) => {
    $(loadingScreen).remove()
    const categories = catRes.trivia_categories;
    categories.forEach((item) => questionCategories.push(item));
    generatePlayBtns();
  });
}
