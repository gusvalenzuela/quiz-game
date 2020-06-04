module.exports = {
  saveToLocalStorage(initials, score) {
    localStorage.setItem(`last-user-initials`, initials);
    var storedInitials = [];
    var storedScores = [];

    storedInitials.push(initials);
    localStorage.setItem(
      this.name + `-stored-initials`,
      JSON.stringify(storedInitials)
    ); // store initials in local storage array

    storedScores.push(parseInt(score)); // push score into working array storedScores
    localStorage.setItem(
      this.name + `-stored-scores`,
      JSON.stringify(storedScores)
    ); // store score in local storage array
    // console.log(`Your storedScores is: ` + storedScores)
  },
  pullTriviaQuestions(amt = 10, cat = 9, diff = `easy`, type = `multiple`) {
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
      playQuiz();
    });
  },
};
