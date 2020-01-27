const navScoreDisplay = document.querySelector(`#avg-scr-display`)
const quizTimeDisplay = document.querySelector(`#time-display`)
const brandLink = document.querySelector(`#brand-link`)
const highScoreLink = document.querySelector(`#high-scores`)
const answerGroup = document.querySelector(`#answer-group`)
const gradeDisplay = document.querySelector(`#grade-display`)
const playBtn = document.querySelector(`#play-button`)
const contColumn = document.querySelector(`#container-col`)
const navBar = document.querySelector(`#navbar`)
const qCountDisplay = document.querySelector(`#question-count`)
const centerDisplay = document.querySelector(`#center-display`)
const penDisplay = document.querySelector(`#penalty-display`)
// const closeBtn = document.querySelector(`#close-btn`)
const questionText = document.querySelector(`#question-text`)
const input = document.createElement(`input`)
const button = document.createElement(`button`)
var userInput
var answerBtns
var qCount = 0
// var timesPlayed = 0     // to show on navBar, maybe; it's classified
var timer = 99
var timeElapsed = 0
var timePenalty = 0
var correctCount = 0
var incorrectCount = 0
var score = timer
var currentSet = []
var interval
var userAnswer
var correct 
var q     
var t   // the ultimate time displayed and later stored as score
var submitBtn
var submit = 0
var storedScores = JSON.parse(localStorage.getItem(`stored-scores`))

// object for current and future user data
var user = {
    name: "",
    initials: "",
    scores: []
}

init()

function init(){
    brandLink.click()       // clicking button to open the modal which houses the welcome message and play button (need to move the click elsewhere)
    getLocalScores()
}
function getLocalScores(){
    // find max of all stored scores in array
    var max = storedScores.reduce(function(a, b) {
        return Math.max(a, b);
    });
    navScoreDisplay.textContent = ` (Your Highest: ` + max + `)`
}
// function to clear time and text displayed 
function clear(){
    timePenalty = 0
    timeElapsed = 0
    questionText.textContent = ""
    answerBtns.textContent = ""
    quizTimeDisplay.textContent = "100"
}
function startTimer(){  
    interval = setInterval(function(){   
        t = (timer - timeElapsed) - timePenalty  // set total time (t)
        // display time until t = 0, then endGame
        if(t > 0){
            timeElapsed++
            quizTimeDisplay.textContent = t
            // console.log(`time remaining: ` + t + ` - time elapsed: ` + timeElapsed + ` - penalty: ` + timePenalty)
        } else {
            endGame()
        }
        // make the timer text red when 10 seconds or under
        // cleared in "endGame()"
        if(t <= 10){
            quizTimeDisplay.setAttribute(`style`, `color: red;`)
        }
    }, 1000)
}
function generateBtns(){
    // adding conditional to make sure it doesn't regenerate buttons when there are no questions left
    if(currentSet.length > 0){
        for(i=0;i<4;i++){
            // creating button, setting appropriate attributes and appending to answer group div
            var btn = document.createElement(`button`)
            btn.setAttribute(`type`, `button`)
            btn.setAttribute(`class`, `col-12 btn-grv p-0`)
            answerGroup.appendChild(btn)
        }
        // assign variable to buttons in answerGroup div
        answerBtns = answerGroup.querySelectorAll(`button`)

    } else {
        // return nothing if current set has no questions left
        return
    }
}
function clearBtns(){
    // simple removal of answerBtns found (for fresh start)
    for(i=0;i<answerBtns.length;i++){
        answerBtns[i].remove()
    }
}
function changeQuestion(){
    // endGame if no questions left, else choose and display new question/choices
    if(currentSet.length === 0){
        // one last check and adding appropriate penalty to account for delay of endGame()
        if(userAnswer === q.answer){
            timePenalty--
        } else {
            timePenalty++
        }
        // delay to allow for score change
        setTimeout(function(){
            endGame()
        }, 1000)
    } else {
        
        qCount++        // keep count of questions asked and display
        qCountDisplay.textContent = `Q:` + qCount 

        var rand = Math.floor(Math.random()*questions.length) // generate random number 0 - questions length
        q = currentSet[rand]    // store random selected question in variable q
        qc = q.choices          // store choices of random question in variable qc
        qcToDisplay = []
         
        questionText.textContent = q.title    // display randomly chosen question's title
    
        // randomize the order of "choices"
        for(i=qc.length;i>0;i--){
            var r = Math.floor(Math.random()*qc.length) // generate random number from 0 - length of choices in a Question object
            qcToDisplay.push(qc[r])
            qc.splice([r], 1)
        }
        
        // display the randomized order of "choices"
        for(i=0;i<qcToDisplay.length;i++){
            answerBtns[i].textContent = qcToDisplay[i]
        }

        currentSet.splice([rand],1)     // splice the randomly chosen question from the working current set (to avoid choosing it again)       
    }

}
function playQuiz() {
    const qs = questions

    // randomizing the order of questions shown each time the quiz is loaded
    for(i=qs.length;i>0;i--){
        var r = Math.floor(Math.random()*qs.length) // generate random number 0-length of Questions Object
        currentSet.push(qs[r])      // pushing question from Questions Object at random (r) index to CurrentSet var
        qs.splice([r], 1)           // removing question from working set (until there are none left to grab)
    }
    console.log(`Let's play!`)
    generateBtns()
    clear()
    startTimer()
    changeQuestion()
}
function rightAnswer(){
    timePenalty = timePenalty - 10      // add time for delay in gradeAnswer()
    correctCount++
    gradeDisplay.setAttribute(`class`, `col p-0 text-success text-center font-weight-bold`)
    gradeDisplay.textContent = `Correct!`
    penDisplay.setAttribute(`class`, `col p-0 text-success text-center font-weight-bold`)
    penDisplay.textContent = `+10 sec`

    // timeout interval to quickly clear the penalty notification
    setTimeout(function(){
        penDisplay.textContent = ``
        gradeDisplay.textContent = ``
    }, 1500)
}
function wrongAnswer(){
    timePenalty = timePenalty + 15      // add time for delay in gradeAnswer()
    incorrectCount++
    // what if no penalty?
    gradeDisplay.setAttribute(`class`, `col p-0 text-danger text-center font-weight-bold`)
    gradeDisplay.textContent = `Incorrect`
    penDisplay.setAttribute(`class`, `col p-0 text-danger text-center font-weight-bold`)
    penDisplay.textContent = `-15 sec`

    // timeout interval to quickly clear the penalty notification
    setTimeout(function(){
        penDisplay.textContent = ``
        gradeDisplay.textContent = ``
    }, 1500)

}
function gradeAnswer(event){
    event.preventDefault()
    var el = event.target
    userAnswer = el.textContent

    /*
     * DO NOT GRADE IF ALREADY GRADED
     * OR DISABLE CLICK
     */

    // just checking if button - in case i change CSS around it
    if(el.type === `button`){
        // checking to see if the selected button's text matches the question's answer
        if(userAnswer === q.answer){
            el.setAttribute(`class`,`col-12 btn-grv p-0 bg-success`)
            rightAnswer() 
        } else {
            // if wrong answer selected, find correct answer and highlight it green
            for(i=0;i<answerBtns.length;i++){
                var aButtonText = answerBtns[i].textContent
                if(aButtonText === q.answer){
                    correct = aButtonText       // may later display this or save to display in final score sheet
                    answerBtns[i].setAttribute(`class`,`col-12 btn-grv p-0 bg-success`)
                    // console.log(`correct answer is: ` + correct)
                } 
            }
            el.setAttribute(`class`,`col-12 btn-grv p-0 bg-danger`)     // highlight the wrong answer red
            wrongAnswer()               
        }           
    } else {
        return
    }        
    setTimeout(function(){
        // after grading each answer we clear the buttons and generate new ones, to reset any formatting
        clearBtns()
        generateBtns()
        // go on to the next question
        changeQuestion()

    },1000)
  
}
function endGame(){
    clearInterval(interval)
    clearBtns()
    answerGroup.remove()
    gradeDisplay.remove()
    qCountDisplay.remove()
    centerDisplay.remove()

    // in the event a penalty brings the total time to under 0, set score to 0
    if(t < 0){
        score = 0
    } else {
        score = t
    }
    
    quizTimeDisplay.setAttribute(`style`, ``)
    quizTimeDisplay.textContent = `Final score: ` + score
    questionText.textContent = `please enter your initials: `
    input.setAttribute(`type`, `text`)
    input.setAttribute(`id`, `user-initials`)
    input.setAttribute(`name`, `user-initials`)
    input.setAttribute(`class`, `m-1`)
    button.setAttribute(`class`, `m-1`)
    button.setAttribute(`type`, `button`)
    button.setAttribute(`id`, `submit-button`)
    button.textContent = `submit`
    questionText.appendChild(input)
    // questionText.appendChild(button)
    userInput = document.querySelector(`#user-initials`)
    submitBtn = document.querySelector(`#submit-button`)
}
function submitInitials(e){
    // e.preventDefault()
    user.initials = userInput.value
    user.initials.toUpperCase
    console.log(submit)

    var keycode = e.keyCode
    // if keyup event is "enter" (keycode 13) then save input as initial and score in local storage
    if((keycode === 13) || (submit === 1)){
        console.log(`keycode is: `+ keycode)
            
        // add conditional not to add p, scores, and initials if p already created
        
        var para = document.createElement(`p`)                                  // create a "thank you" confirmation p tag
        para.setAttribute(`class`, ``)
        para.setAttribute(`id`, `user-confirmation`)
        para.textContent = `Thank you for playing!`
        questionText.appendChild(para)
        
        localStorage.setItem(`stored-initials`, user.initials)                  // store initials in local storage
        storedScores.push(parseInt(score))                                      // push score into working array storedScores
        localStorage.setItem(`stored-scores`, JSON.stringify(storedScores))     // store score in local storage array
    } 
}

// listeners
playBtn.addEventListener(`click`, playQuiz)
brandLink.addEventListener(`click`, function(){
    window.location.reload(true);
})
answerGroup.addEventListener(`click`, gradeAnswer)
input.addEventListener(`keyup`, submitInitials)
// questionText.addEventListener(`click`, function(e){
//     submit = 1
//     console.log(submit)
//     submitInitials()
// })

// pause, because
// highScoreLink.addEventListener(`click`, pauseTimer)