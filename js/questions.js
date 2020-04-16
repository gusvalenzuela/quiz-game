// var catQs = [
//     {
//         title: `Humans have 12 thoracic vertebrae (middle segment of spine), how many do cats have?`,
//         choices: [
//             `8`,
//             `12`,
//             `13`,
//             `18`],
//         answer: `13`
//     },
//     {
//         title: `What was the real name of the American internet celebrity cat better known as "Grumpy Cat"?`,
//         choices: [
//             `Soy Sauce`,
//             `Tardar Sauce`,
//             `Major Mustard`,
//             `Kaptain Ketchup`],
//         answer: `Tardar Sauce`
//     },
//     {
//         title: `A group of kittens is called a:`,
//         choices: [
//             `kindle`,
//             `murder`,
//             `flock`,
//             `clowder`],
//         answer: `kindle`
//     },
//     {
//         title: `A "lover of cats" would be also be known as:`,
//         choices: [
//             `a felophile`,
//             `an ailurophile`,
//             `a ceraunophile`,
//             `a cynophile`],
//         answer: `an ailurophile`
//     },
//     {
//         title: `Cats have more bones in their entire body than humans do; how many bones do cats have?`,
//         choices: [
//             `150`,
//             `303`,
//             `400`,
//             `244`],
//         answer: `244`
//     },
// ];
// var dogQs = [
//     {
//         title: `Contrary to popular belief, dogs do not sweat by salivating. They sweat through... `,
//         choices: [
//             `the pads of their feet.`,
//             `the tip of their nose.`,
//             `panting.`,
//             `the base of their head.`],
//         answer: `the pads of their feet.`
//     },
//     {
//         title: `Fill in the blank: ______ is the only barkless dog in the world.`,
//         choices: [
//             `The Greyhound`,
//             `The Australian Cattle Dog`,
//             `The Basenji`,
//             `The English Wolfhound`],
//         answer: `The Basenji`
//     },
//     {
//         title: `All dogs, regardless of breed, are direct descendants of this animal:`,
//         choices: [
//             `Wolf`,
//             `Lynx`,
//             `Opposum`,
//             `Human`],
//         answer: `Wolf`
//     },
//     {
//         title: `Nearly all but two breeds of dogs have pink tongues: the Chow Chow and the Shar-pei both have this color tongues.`,
//         choices: [
//             `Brown`,
//             `Red`,
//             `Black`,
//             `Orange`],
//         answer: `Black`
//     },
//     {
//         title: `Fill in the blank: An adult dog has __ teeth`,
//         choices: [
//             `24`,
//             `Too Many`,
//             `42`,
//             `33`],
//         answer: `42`
//     },
// ];
// var salmonQs = [
//     {
//         title: `This is a Salmon question #1`,
//         choices: [
//             `A`,
//             `B`,
//             `C`,
//             `D`],
//         answer: `A`
//     },
//     {
//         title: `This is a Salmon question #2`,
//         choices: [
//             `A`,
//             `B`,
//             `C`,
//             `D`],
//         answer: `D`
//     },
//     {
//         title: `This is a Salmon question #3`,
//         choices: [
//             `A`,
//             `B`,
//             `C`,
//             `D`],
//         answer: `C`
//     },
//     {
//         title: `This is a Salmon question #4`,
//         choices: [
//             `A`,
//             `B`,
//             `C`,
//             `D`],
//         answer: `C`
//     },
//     {
//         title: `This is a Salmon question #5`,
//         choices: [
//             `A`,
//             `B`,
//             `C`,
//             `D`],
//         answer: `B`
//     },
// ];

function QuestionsFull(title, answer, choices) {
    this.title = title;
    this.answer = answer
    this.choices = choices
}

// object holding individual arrays
// var questionsObj = {
//     cat: catQs,
//     dog: dogQs,
//     salmon: salmonQs
// }

// pullTriviaQuestions()
function pullTriviaQuestions(amt = 15, cat = 9, diff = `easy`, type = `multiple`) {
    // console.log(`running pullTrivia...`)
    const settings = {
        "async": true,
        "crossDomain": true,
        // url: `http://jservice.io/api/random?count=10`,
        "url": `https://opentdb.com/api.php?amount=` + amt + `&category=` + cat + `&difficulty=` + diff + `&type=` + type + `&encode=url3986`,
        "method": `GET`,
    }
    $.ajax(settings).then(r => {
        console.log(`AJAX RESPONSE RECEIVED...`)

        // console.log(r)
        r.results.forEach(item => {
            let choices = item.incorrect_answers.map(data => decodeURIComponent(data))
            choices.push(decodeURIComponent(item.correct_answer))
            let itemQues = new QuestionsFull(decodeURIComponent(item.question), decodeURIComponent(item.correct_answer), choices)
            questions.push(itemQues)
        });
        
        playQuiz()
    })
}
// }

