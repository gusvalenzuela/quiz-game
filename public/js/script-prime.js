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
let timer = 256;
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
  storedInitials,
  currentRightSound,
  currentWrongSound;
let submit = 0;
let rightAnswerSound = new Audio(currentRightSound);
let wrongAnswerSound = new Audio(currentWrongSound);

init();

function init() {
  t = timer - timeElapsed;
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
    $(loadingScreen).remove();
    const categories = catRes.trivia_categories;
    categories.forEach((item) => questionCategories.push(item));
    generatePlayBtns();
  });
}

class QuestionsFull {
  constructor(title, answer, choices) {
    this.title = title;
    this.answer = answer;
    this.choices = choices;
  }
}

// pullTriviaQuestions()
function pullTriviaQuestions(
  amt = 10,
  cat = 9,
  diff = `easy`,
  type = `multiple`
) {
  $(`.play-screen`).show();
  $(`#quiz-options-form`).remove();
  $(`.loading-screen`).remove();
  // console.log(`running pullTrivia...`)
  const settings = {
    async: true,
    crossDomain: true,
    url:
      `https://opentdb.com/api.php?amount=` +
      amt +
      `&category=` +
      parseInt(cat) +
      `&difficulty=` +
      diff +
      `&type=` +
      type +
      `&encode=url3986`,
    method: `GET`,
  };

  $.ajax(settings).then((r) => {
    // console.log(`AJAX RESPONSE RECEIVED...`)

    if (r.response_code == 1) {
      console.log(`something went wrong, response code: `, r.response_code);
      $(`.play-screen`).html(
        `<h1 style="color:white; padding:1em;">OOPS SOMETHING WENT WRONG, REFRESHING THE PAGE.</h1>`
      );
      setTimeout(() => {
        location.reload();
      }, 2000);
    }

    let categoryChosen = r.results[0].category;
    let difficultyChosen = r.results[0].difficulty;
    // console.log(r)
    r.results.forEach((item) => {
      let choices = item.incorrect_answers.map((data) =>
        decodeURIComponent(data)
      );
      choices.push(decodeURIComponent(item.correct_answer));
      let itemQues = new QuestionsFull(
        decodeURIComponent(item.question),
        decodeURIComponent(item.correct_answer),
        choices
      );
      questions.push(itemQues);
    });
    var colorCodeDifficulty = `green`;
    if (difficultyChosen.toLowerCase() === `hard`) {
      colorCodeDifficulty = `red`;
    } else if (difficultyChosen.toLowerCase() === `medium`) {
      colorCodeDifficulty = `yellow`;
    }
    $(`#category-name`).html(
      `<h4 id="category-name-header">${decodeURIComponent(
        categoryChosen
      )}</h4> <p style="font-weight: 400; font-style:italic; color: ${colorCodeDifficulty};">${difficultyChosen.toLowerCase()}<p>`
    );
    $(`#category-name`).data(`cat-id`, cat);
    $(`#category-name`).data(`cat-name`, decodeURIComponent(categoryChosen));
    $(`#category-name`).data(`cat-difficulty`, difficultyChosen);
    // console.log($(`#category-name`).data(`catId`))
    playQuiz();
  });
}

let amtSelected = 10; //default
$(quizOptionsForm).on(`submit`, (e) => {
  e.preventDefault();
  const selCat = $(`#quiz-options-select`)[0];
  const selDiff = $(`#select-difficulty`)[0];
  // const amtSelected = $(`#select-amount`).val().trim()

  for (category of questionCategories) {
    if (
      selCat.value.trim() === `(Random Category)` &&
      selDiff.value.trim() !== `Choose...`
    ) {
      let randomID = Math.ceil(Math.random() * questionCategories.length) + 8;
      return pullTriviaQuestions(
        amtSelected,
        randomID,
        selDiff.value.trim().toLowerCase()
      );
    } else if (
      selCat.value.trim() !== `Choose...` &&
      selCat.value.trim() !== null &&
      selCat.value.trim() === category.name &&
      selDiff.value.trim() !== `Choose...`
    ) {
      return pullTriviaQuestions(
        amtSelected,
        category.id,
        selDiff.value.trim().toLowerCase()
      );
    }
  }
});

function generatePlayBtns() {
  // making a play ("start quiz") button
  const start = $(
    `<button id="play-button" class="play-btn w-100 text-white my-3" type="submit">`
  ).text(`PLAY!`);

  const selectCategory = $(`<select id="quiz-options-select" class="col">`)
    .append($(`<option>`).text(`Choose...`)) // initial "blank" option box
    .append($(`<option>`).text(`(Random Category)`)); // initial "random" option box

  // making a dropdown select list for desired amount of questions
  const selectAmount = $(`<select id="select-amount" class="col">`)
    .append($(`<option>`).text(`5`))
    .append($(`<option>`).text(`10`))
    .append($(`<option>`).text(`15`));

  // if i want to make a long list of options available to selectAmount
  for (i = 5; i < 10; i++) {
    let option = document.createElement(`option`);
    option.textContent = i;
    option.setAttribute(`value`, i);
    selectAmount.append(option);
  }

  // making a dropdown select list for desired difficulty of questions
  // has set difficulties of easy, medium, hard
  const selectDifficulty = $(`<select id="select-difficulty" class="col">`)
    .append($(`<option>`).text(`Choose...`))
    .append($(`<option>`).text(`Easy`))
    .append($(`<option>`).text(`Medium`))
    .append($(`<option>`).text(`Hard`));

  // rest of options dependent on available categories
  for (category of questionCategories) {
    let option = $(`<option value="${category.name}">`).text(category.name);
    $(selectCategory).append(option);
  }

  quizCategoryDiv.append(selectCategory[0]);
  quizDifficultyDiv.append(selectDifficulty[0]);
  playButtonDiv.append(start[0]);

  loadingScreen.innerHTML = ``; // clearing "loading screen"
  $(`.selection-screen`).show();

  // acting on random modes
  $(`.random-modes`).on(`click`, (event) => {
    let randomID = Math.ceil(Math.random() * questionCategories.length) + 8;
    switch ($(event.target).text()) {
      case `medium`:
        pullTriviaQuestions(amtSelected, randomID, `medium`);
        break;
      case `hard`:
        pullTriviaQuestions(amtSelected, randomID, `hard`);
        break;
      default:
        pullTriviaQuestions(amtSelected, randomID, `easy`);
        break;
    }
  });
}
// function to clear time and text displayed
function clear() {
  timePenalty = 0;
  timeElapsed = 0;
  questionText.textContent = "";
  answerBtns.textContent = "";
  $(quizTimeDisplay).html(`256`).attr(`value`, t);
}
function startTimer() {
  interval = setInterval(function () {
    timeElapsed++;
    if (t > 1) {
      updateTimerandDisplay();
    } else {
      endGame();
    }
    // make the timer text red when 10 seconds or under
    if (t <= 10) {
      quizTimeDisplay.setAttribute(`style`, `color: red;`);
    }
  }, 1000);
}
const updateTimerandDisplay = () => {
  t = timer - timeElapsed - timePenalty;
  $(quizTimeDisplay).html(t).attr(`value`, t);
  return t; // set total time (t)
  // display time until t = 0, then endGame
};
function generateBtns() {
  // adding conditional to make sure it doesn't regenerate buttons when there are no questions left
  if (currentSet.length > 0) {
    for (i = 0; i < 4; i++) {
      // creating button, setting appropriate attributes and appending to answer group div
      var btn = document.createElement(`button`);
      btn.setAttribute(`type`, `button`);
      btn.setAttribute(`class`, `col-12 btn-grv`);
      // bring back the clicking (pointer-event)
      answerGroup.setAttribute(
        `class`,
        `row btn-group-vertical answer-group w-100`
      );
      answerGroup.appendChild(btn);
    }
    // assign variable to buttons in answerGroup div
    answerBtns = answerGroup.querySelectorAll(`button`);
  } else {
    // return nothing if current set has no questions left
    return endGame();
  }
}
function clearBtns() {
  // simple removal of answerBtns found (for fresh start)
  answerBtns.forEach((i) => $(i).remove());
}
function changeQuestion() {
  startTimer();
  if (t < 1) {
    return endGame();
  }

  // endGame if no questions left, else choose and display new question/choices
  if (currentSet.length === 0) {
    // one last check and adding appropriate penalty to account for delay of endGame()
    if (userAnswer === q.answer) {
      --timePenalty;
    } else {
      ++timePenalty;
    }
    clearBtns();
    quizTimeDisplay.textContent = "";
    questionText.textContent = "";
    answerGroup.remove();
    // gradeDisplay.remove();
    $(`.left-row`).remove();
    centerDisplay.remove();

    // delay to allow for _____
    setTimeout(function () {
      endGame();
    }, 500);
  } else {
    qCount++; // keep count of questions asked and display
    qCountDisplay.textContent = `${qCount}/${amtSelected}`;

    var rand = Math.floor(Math.random() * questions.length); // generate random number 0 - questions length ¯\_(ツ)_/¯
    q = currentSet[rand]; // store random selected question in variable q
    qc = q.choices; // store choices of random question in variable qc
    qcToDisplay = [];

    questionText.textContent = q.title; // display randomly chosen question's title

    // randomize the order of "choices"
    for (i = qc.length; i > 0; i--) {
      var r = Math.floor(Math.random() * qc.length); // generate random number from 0 - length of choices in a Question object
      qcToDisplay.push(qc[r]);
      qc.splice([r], 1);
    }

    // display the randomized order of "choices"
    for (i = 0; i < qcToDisplay.length; i++) {
      answerBtns[i].textContent = qcToDisplay[i];
    }

    currentSet.splice([rand], 1); // splice the randomly chosen question from the working current set (to avoid choosing it again)
  }

  $(answerGroup).on(`click`, gradeAnswer);
}
function playQuiz() {
  const qs = questions;

  // randomizing the order of questions shown each time the quiz is loaded
  for (i = qs.length; i > 0; i--) {
    var r = Math.floor(Math.random() * qs.length); // generate random number 0-length of Questions Object
    currentSet.push(qs[r]); // pushing question from Questions Object at random (r) index to CurrentSet var
    qs.splice([r], 1); // removing question from working set (until there are none left to grab)
  }
  console.log(`Let's play!`);
  generateBtns();
  clear();
  changeQuestion();

  // shortcut to end screen, because
  // bug: when shortcut used, the storedScores are stored as string (want integer)
  $(quizTimeDisplay).dblclick(() => {
    console.log(`click clock`);
    endGame();
  });
}

function rightAnswer() {
  rightAnswerSound.play(); // playing sound effect
  penDisplay.textContent = `+10 sec`;
  answerGroup.setAttribute(
    `class`,
    `row btn-group-vertical answer-group w-100 disable-click`
  ); // disable click with CSS class (gotta be a better way)
  answerGroup.setAttribute(`style`, `text-decoration: none; border:none;`);
  timePenalty -= 10; // add (2sec) for delay in gradeAnswer()

  correctCount++;
  // gradeDisplay.setAttribute(
  //   `class`,
  //   `col text-success text-center font-weight-bold`
  // );
  // gradeDisplay.textContent = `Correct!`;

  penDisplay.setAttribute(`class`, `col text-success`);

  // timeout interval to quickly show graded answer
  setTimeout(function () {
    updateTimerandDisplay();
    penDisplay.textContent = ``;
    // gradeDisplay.textContent = ``;
  }, 2000);
}
function wrongAnswer() {
  wrongAnswerSound.play(); // playing sound effect
  answerGroup.setAttribute(
    `class`,
    `row btn-group-vertical answer-group w-100 disable-click`
  ); // disable click with CSS class (gotta be a better way)
  timePenalty += 15; // add time (2sec) for delay in gradeAnswer()

  incorrectCount++;
  // what if no penalty?
  // gradeDisplay.setAttribute(
  //   `class`,
  //   `col text-danger text-center font-weight-bold`
  // );
  // gradeDisplay.textContent = `Incorrect`;
  penDisplay.setAttribute(`class`, `col text-danger`);
  penDisplay.textContent = `-15 sec`;

  // timeout interval to quickly clear the penalty notification
  setTimeout(function () {
    updateTimerandDisplay();
    penDisplay.textContent = ``;
    // gradeDisplay.textContent = ``;
  }, 2000);
}
function gradeAnswer(event) {
  event.stopImmediatePropagation();
  var el = event.target;
  userAnswer = el.textContent;
  clearInterval(interval);

  // just checking if button - in case i change CSS around it
  if (el.type === `button`) {
    // $(el).addClass(`disable-click`)

    // checking to see if the selected button's text matches the question's answer
    if (userAnswer === q.answer) {
      el.setAttribute(`class`, `col-12 btn-grv bg-success`);
      rightAnswer();
    } else {
      // if wrong answer selected, find correct answer and highlight it green
      for (i = 0; i < answerBtns.length; i++) {
        var aButtonText = answerBtns[i].textContent;
        if (aButtonText === q.answer) {
          correct = aButtonText; // may later display this or save to display in final score sheet
          answerBtns[i].setAttribute(`class`, `col-12 btn-grv bg-success`);
          // console.log(`correct answer is: ` + correct)
        }
      }
      el.setAttribute(`class`, `col-12 btn-grv bg-danger`); // highlight the wrong answer red
      wrongAnswer();
    }
  } else {
    return;
  }
  // timeout of 1sec to display right/wrong answer to user (via button background color)
  setTimeout(function () {
    // after grading each answer we clear the buttons and generate new ones, to reset any formatting
    clearBtns();
    generateBtns();
    // go on to the next question
    changeQuestion();
  }, 2000);
}
const endGame = (e) => {
  clearInterval(interval);
  clearBtns();
  answerGroup.remove();
  // gradeDisplay.remove();
  $(`#question-count-parent`).remove();
  centerDisplay.remove();
  questionText.innerHTML = ``;

  // in the event a penalty brings the total time to under 0, set score to 0
  if (t < 0) {
    score = 0;
  } else {
    score = t;
  }

  console.log(`Time left @ end of game: ${t}`);

  if (t > 0) {
    $(`.end-screen`).show();
    // const submitInitialsRow = `#submit-initials-row`;

    $(quizTimeDisplay)
      .attr(`style`, `font-color: white;`)
      .html(`Final Score: ${score}`);
    const form = $(`<form id="initials-form">`);
    const inputLabel = $(`<label for="#user-initials">`).text(
      `Enter your initials:`
    );
    const inputText = $(`<input>`)
      .attr(`type`, `text`)
      .attr(`style`, `text-transform: uppercase`)
      .attr(`id`, `user-initials`)
      .attr(`name`, `user-initials`)
      .attr(`class`, `col-12 m-1 text-center`)
      .attr(`maxlength`, `3`);
    const submitBtn = $(
      `<input class="m-1 btn btn-light btn-sm rounded-0" value="Submit" type="submit" role="submit">`
    );
    form.append(inputLabel, inputText, submitBtn);
    $(questionText).append(form, $(`<hr>`));
    userInput = document.querySelector(`#user-initials`);

    $(`#initials-form`).on(`submit`, function (e) {
      e.preventDefault();
      if (inputText.val().trim() === "") {
        alert(`Please enter your initials (Max: 3 Characters)`);
      } else {
        enterScoreToDB();
        // thankForSubmission();
      }
    });
  } else {
    let elementToRemove = $(`#question-text`)[0].parentElement;
    $(elementToRemove).remove();
  }

  // generateReportCard()
  // console.log(this)
  // hiScoreList();
};
const hiScoreList = () => {
  var div = document.createElement(`div`);
  div.setAttribute(`class`, ``);
  div.setAttribute(`id`, `high-score-list`);
  div.setAttribute(`class`, `row text-white text-center py-2`);
  $(mainContainer).appendChild(div);
  highScoreDiv = document.querySelector(`#high-score-list`);
  // making h4 tag with the score list header
  var h4 = document.createElement(`h4`);
  h4.setAttribute(`class`, `text-center col-12`);
  h4.textContent = this.name.toUpperCase() + ` HIGH SCORES`;
  highScoreDiv.appendChild(h4);

  var descScoreList = storedScores;
  descScoreList = descScoreList.sort(function (a, b) {
    // var index = descScoreList.indexOf(a)
    // console.log(index)
    return b - a;
  });
  // var descInitialsList =

  for (i = 0; i < descScoreList.length; i++) {
    var p = document.createElement(`p`);
    var icon = document.createElement(`i`);
    p.setAttribute(`class`, `text-center m-0 col-12`);
    p.setAttribute(`id`, `score-` + i); // tie ID to index
    icon.setAttribute(`class`, `fa fa-close mx-2`);
    icon.setAttribute(`style`, `font-size:14px`);
    icon.setAttribute(`id`, `close-icon-` + i);
    icon.setAttribute(`title`, `close-icon`);

    var descScoreListPrint;

    if (descScoreList[i] < 10) {
      descScoreListPrint = `00` + descScoreList[i];
    } else if (descScoreList[i] < 100) {
      descScoreListPrint = `0` + descScoreList[i];
    }

    // score = parseInt(`0`+score)
    p.textContent = storedInitials[i] + ` ` + descScoreListPrint; // sorting in high score but doesnt sort initials with it
    highScoreDiv.appendChild(p);
    p.prepend(icon);
  }

  highScoreDiv.addEventListener(`click`, function (event) {
    // event.stopPropagation()
    var el = event.target;
    var lastCharScoreID;
    var lastCharCloseID;
    // console.log(`element id is: ` + el.id)
    // console.log(el.parentElement.textContent)

    if (el.title === `close-icon`) {
      var lenghtofScoreID;
      var lengthofCloseID = el.id.length;
      lastCharCloseID = el.id[lengthofCloseID - 1];
      // el.remove()
      var parentID = `#score-` + lastCharCloseID;
      var parentElement = document.querySelector(parentID);
      console.log(parentElement);
      // confirm(`are you sure you want to remove this record?\ncannot be undone.`)
      // parentElement.remove()
      // find way to delete that particular record,
      // alert(`Just kidding, i haven't coded it that far\nthat record will return when you refresh the game`)

      // console.log(`the selected score paragrap tag is: `+grabParent)
      console.log(`last character is: ` + lastCharCloseID);
      console.log(`length of ID ` + lengthofCloseID);
    }
  });
};

const enterScoreToDB = () => {
  let newScore = {
    initials: userInput.value.trim().toUpperCase(),
    score: score,
    category: $(`#category-name`).data(`catId`),
    category_name: $(`#category-name`).data(`catName`),
    difficulty: $(`#category-name`).data(`catDifficulty`),
    dateEntered: Date.now(),
  };

  $.post(`/submit`, newScore, (results) => {
    console.log(results);
    populateScores();
  });
};

const populateScores = () => {
  $(`#question-text-parent`).remove();
  $(`#display-row`).remove();

  $.get(`/api/scores`, (storedScores) => {
    let scoreContainer = $(
      `<div class="row text-white text-center py-2" id="high-score-list">`
    );
      console.log(storedScores)
    $(mainContainer).append(scoreContainer);
    highScoreDiv = document.querySelector(`#high-score-list`);

    // // making h4 tag with the score list header
    // var h4 = document.createElement(`h4`);
    // h4.setAttribute(`class`, `text-center col-12`);
    // h4.textContent = this.name.toUpperCase() + ` HIGH SCORES`;
    // highScoreDiv.appendChild(h4);

    for (i = 0; i < storedScores.length; i++) {
      var p = document.createElement(`p`);
      var icon = document.createElement(`i`);
      p.setAttribute(`class`, `text-center m-0 col-12`);
      p.setAttribute(`id`, `score-` + i); // tie ID to index
      icon.setAttribute(`class`, `fa fa-close mx-2`);
      icon.setAttribute(`style`, `font-size:14px`);
      icon.setAttribute(`id`, `close-icon-` + i);
      icon.setAttribute(`title`, `close-icon`);

      var storedScoresPrint;
      var descInitialsPrint;

      if (storedScores[i] < 10) {
        storedScoresPrint = `00` + storedScores[i];
      } else if (storedScores[i] < 100) {
        storedScoresPrint = `0` + storedScores[i];
      }

      // score = parseInt(`0`+score)
      p.textContent = storedScores[i].initials + ` ` + storedScores[i].score; // sorting in high score but doesnt sort initials with it
      scoreContainer.append(p);
      p.prepend(icon);
    }
  });
};

const thankForSubmission = () => {
  user.initials = userInput.value.toUpperCase();
  var uInit = userInput.value.toUpperCase();
  questionText.remove();

  quizTimeDisplay.setAttribute(`class`, `col bg-grv text-warning`);
  quizTimeDisplay.setAttribute(`style`, `font-size: 32px;`);
  quizTimeDisplay.textContent = `Thank you for playing!`;

  // making p tag to add newest initials and scores to list (function this out)
  var p = document.createElement(`p`);
  var icon = document.createElement(`i`);
  icon.setAttribute(`class`, `fa fa-close mx-2`);
  icon.setAttribute(`style`, `font-size:14px`);
  icon.setAttribute(`title`, `close-icon`);
  p.setAttribute(`class`, `text-center m-0 bg-warning text-dark col-12`);
  // icon.setAttribute(`id`, `close-icon-` + ?????)
  // p.setAttribute(`id`,`score-` + ??????)                  // tie ID to index
  var scorePrint;
  if (score < 10) {
    scorePrint = `00` + score;
  } else if (score < 100) {
    scorePrint = `0` + score;
  } else {
    scorePrint = score;
  }

  p.textContent = uInit + ` ` + scorePrint;
  $(highScoreDiv).append(p);
  p.prepend(icon);
};
