class QuestionsFull {
  constructor(title, answer, choices) {
    this.title = title;
    this.answer = answer;
    this.choices = choices;
  }
}

// pullTriviaQuestions()
function pullTriviaQuestions(
  amt = 15,
  cat = 9,
  diff = `easy`,
  type = `multiple`
) {

  // console.log(`running pullTrivia...`)
  console.log(`category random num: `, cat);
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
    let categoryChosen = r.results[0].category

    if (categoryChosen === undefined) {
      location.reload()
      console.log(`something went wrong, here are the results...`, r);
    }

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

    playQuiz(decodeURIComponent(categoryChosen));
  });
}
