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

    // console.log(`here are the results...`, r.response_code);
    
    if (r.response_code === 1) {
      $(`.selection-screen`).html(`<h1 style="color:white;">OOPS SOMETHING WENT WRONG, REFRESHING THE PAGE.</h1>`)
      setTimeout(() => {
        location.reload()

      }, 2000)
    }

    let categoryChosen = r.results[0].category
    let difficultyChosen = r.results[0].difficulty
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
    $(`#category-name`).html(`<h3 id="category-name-header">${decodeURIComponent(categoryChosen)}</h3> <p style="font-weight: 400; font-style:italic;">${difficultyChosen.toLowerCase()}<p>` )
    $(`#category-name`).data(`cat-id`,cat)
    $(`#category-name`).data(`cat-name`,decodeURIComponent(categoryChosen))
    // console.log($(`#category-name`).data(`catId`))
    playQuiz(decodeURIComponent(categoryChosen, cat));
  });
}
