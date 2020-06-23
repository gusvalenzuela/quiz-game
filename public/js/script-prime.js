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
  currentWrongSound,
  catDifficulty,
  catID,
  catName;
let submit = 0;
let rightAnswerSound = new Audio(currentRightSound);
let wrongAnswerSound = new Audio(currentWrongSound);

let amtSelected = 10; //default

class QuestionsFull {
  constructor(title, answer, choices) {
    this.title = title;
    this.answer = answer;
    this.choices = choices;
  }
}

let quizData = {
  name: "",
  questions: [],
};

$(window).on("load", function () {
  // code here

  init();

  function init() {
    t = timer - timeElapsed;
    $(`.play-screen`).hide();
    $(`.selection-screen`).hide();
    $(loadingScreen).html(
      `<h1 style="color: white;">LOADING CATEGORIES...</h1>`
    );
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

  function pullTriviaQuestions(
    amt = 10,
    cat = 9,
    diff = `easy`,
    type = `multiple`
  ) {
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
        $(`#main-main`).html(
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
        let itemQues = {
          title: decodeURIComponent(item.question),
          answer: decodeURIComponent(item.correct_answer),
          choices: choices,
        };
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
      $(`.play-screen`).show();
      playQuiz();
    });
  }

  // listening for category and difficulty selection
  $(quizOptionsForm).on(`submit`, (e) => {
    $(mainContainer).hide();
    e.preventDefault();

    const selCat = $(`#quiz-options-select`)[0];
    const selDiff = $(`#select-difficulty`)[0];
    // const amtSelected = $(`#select-amount`).val().trim() // needs to be tied to timer

    for (category of questionCategories) {
      if (
        selCat.value.trim() === `(Random Category)` &&
        selDiff.value.trim() !== `Choose...`
      ) {
        let randomID = Math.ceil(Math.random() * questionCategories.length) + 8;
        // API.pullTriviaQuestions()
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
        // API.pullTriviaQuestions()
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
      if (t > 0) {
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
      let tempQ = [];
      // randomize the order of "choices"
      for (i = qc.length; i > 0; i--) {
        var r = Math.floor(Math.random() * qc.length); // generate random number from 0 - length of choices in a Question object
        qcToDisplay.push(qc[r]);
        tempQ.push(qc[r]);
        qc.splice([r], 1);
      }

      quizData.questions.push(q); // pushing the currently selected Question into obj holding the info for game
      quizData.questions[quizData.questions.length - 1].choices = tempQ; // for some reason need to push choices into a temp array and reassign (during randomizing); might be doing something wrong

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
    correctCount = 0;
    incorrectCount = 0;
    catDifficulty = $(`#category-name`).data(`catDifficulty`);
    catID = $(`#category-name`).data(`catId`);
    catName = $(`#category-name`).data(`catName`);
    quizData.name = catID + "-" + catName.toLowerCase() + "-" + catDifficulty.toLowerCase();

    $(mainContainer).show(); // hidden while pulling trivia questions

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
    clearInterval(interval);
    var el = event.target;
    userAnswer = el.textContent;

    // just checking if button - in case i change CSS around it
    if (el.type === `button`) {
      quizData.questions[quizData.questions.length - 1].chose = userAnswer; // adding property chose to latest question in our info obj
      // $(el).addClass(`disable-click`)

      // checking to see if the selected button's text matches the question's answer
      if (userAnswer === q.answer) {
        el.setAttribute(`class`, `col-12 btn-grv bg-success`);
        quizData.questions[quizData.questions.length - 1].answer = "right"; // clearing the answer so as to not save it in the db
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
        quizData.questions[quizData.questions.length - 1].answer = "wrong"; // clearing the answer so as to not save it in the db
        wrongAnswer();
      }
    } else {
      return;
    }

    // timeout to display right/wrong answer to user (via button background color)
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

    $(mainContainer).empty();
    $(mainContainer).addClass(`border-color-${catDifficulty}`);
    $(`#main-main`).attr(`style`, `margin-top: inherit !important;`);
    const scoreScreen = $(
      '<div class="row text-white justify-content-center score-screen">'
    );

    // in the event a penalty brings the total time to under 0, set score to 0
    if (t < 0) {
      score = 0;
    } else {
      score = t;
    }

    if (t > 0) {
      // const submitInitialsRow = `#submit-initials-row`;

      const form = $(`<form id="initials-form" class="col-12">`);
      const scoreTally = $(`<div style="color: #f4a460">`).html(
        `<h4 style="font-weight: 400;">CONGRATULATIONS!</h4><h4 style="font-weight: 900;">SCORE: ${score}</h4>`
      );
      const inputLabel = $(`<h5>`).text(`Enter your initials:`);
      const inputText = $(
        `<input class="user-initials-input" autocomplete="false" placeholder="---">`
      )
        .attr(`type`, `text`)
        .attr(`id`, `user-initials`)
        .attr(`name`, `user-initials`)
        .attr(`maxlength`, `3`);
      const submitBtn = $(
        `<input class="m-1 btn btn-outline-primary btn-sm rounded-0" value="Submit" type="submit" role="submit">`
      );

      form.append(inputLabel, inputText, submitBtn);
      $(scoreScreen).append(scoreTally, form, $(`<hr>`));

      $(mainContainer).append(scoreScreen);

      $(`#initials-form`).on(`submit`, function (e) {
        $(`#time-display-parent`).removeClass(`bg-grv`);
        e.preventDefault();
        if (inputText.val().trim() === "") {
          alert(`Please enter your initials (Max: 3 Characters)`);
        } else {
          enterScoreToDB(inputText.val().trim().toUpperCase());
          // thankForSubmission();
        }
      });
    } else {
      $(mainContainer).append($(`<h2>`).text(`Better Luck Next Time!`));
    }

    // generateReportCard()
    // console.log(this)
    // hiScoreList();
  };
  const enterScoreToDB = (initials) => {
    // console.log(`questions`, quizData);
    let newScore = {
      initials: initials,
      score: score,
      category: {
        name: catName,
        id: Number(catID),
        difficulty: catDifficulty,
      },
      dateEntered: Date.now(),
      quiz: {
        ...quizData,
        correct: correctCount,
        incorrect: incorrectCount,
        total: correctCount + incorrectCount,
      },
    };
    $.post(`/submit`, newScore, (res) => {
      populateScores(newScore);
    });
  };

  const populateScores = () => {
    $(`#question-text-parent`).remove();
    $(`#count-penalty-time-display-row`).remove();

    $.get(`/api/scores/${catDifficulty}/${catID}`, (storedScores) => {
      $(`.score-screen`).remove();

      let scoreTable = $(
        `<table class="high-score-table" id="high-score-table" data-difficulty="${catDifficulty}" data-category="${catName}">`
      );
      let scoreTableHeader = $(`<tr class="high-score-table-header">`)
        .append($(`<th>`).text(`RANK`))
        .append($(`<th>`).text(`SCORE`))
        .append($(`<th>`).text(`NAME`))
        .append($(`<th>`).text(`CORRECT`));

      console.log(storedScores);
      // making h4 tag with the score list header
      var h4 = $(`<h4>`).text(`HIGH SCORES`);
      $(mainContainer).append(h4, scoreTable.append(scoreTableHeader));

      storedScores.forEach((score, index) => {
        let tr = $(`<tr>`).attr(`data-score-id`, score._id);
        var tdA = $(`<td>`);
        var tdB = $(`<td>`);
        var tdC = $(`<td>`);
        var tdD = $(`<td>`);
        var icon = document.createElement(`span`);
        icon.setAttribute(`class`, `fa fa-close mx-2`);
        icon.setAttribute(`style`, `font-size:14px`);
        icon.setAttribute(`data-score-id`, score._id);
        icon.setAttribute(`title`, `close-icon`);

        tdA.text(`${index + 1}.`);
        tdB.text(`${String(score.score).padStart(5, "0") || `N/A`}`);
        tdC.text(`${score.initials || `N/A`}`);
        tdD.text(`${score.quiz.correct}/${score.quiz.total}`);
        $(scoreTable).append($(tr).append(tdA, tdB, tdC, tdD));
      });

      $(scoreTable).on(`click`, function (event) {
        // event.stopPropagation()
        var el = event.target;

        if (el.title === `close-icon`) {
          confirm(
            `are you sure you want to remove this record?\ncannot be undone.`
          );

          if (!confirm) {
            return;
          } else {
            $.ajax({
              url: "/api/deletescore/" + $(el).data(`scoreId`),
              type: "DELETE",
              success: function (result) {
                console.log(`deleted ${result.deletedCount} records`);
                window.location.href = "/";
              },
            });
          }
        }
      });
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

  // end of load wrap
});
