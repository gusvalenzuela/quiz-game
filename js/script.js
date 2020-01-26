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
// object for current and future user data
var user = {
    name: "",
    initials: "",
    scores: []
}

var userInput
var answerBtns
var submitBtn
var qCount = 0
// var timesPlayed = 0     // to show on navBar, maybe; it's classified
var timer = 99
var timeElapsed = 0
var timePenalty = 0
var correctCount = 0
var incorrectCount = 0
var score = timer
var currentSet = []
// var currentChoicesSet = []
var interval
var userAnswer
var storedScores = [];
var q     
var t   // the ultimate time displayed and later stored as score
// function wait(){w = setInterval(function(){},250)} // at one point i wanted to add a splash between questions

init()

function init(){
    brandLink.click()       // clicking button to open the modal which houses the welcome message and play button (need to move the click elsewhere)
    getLocalScores()
}
function getLocalScores(){
    var localScores = localStorage.getItem(`stored-scores`)
    console.log(localScores)
    // storedScores = 
    // find max of all stored scores in array
    // var max = storedScores.reduce(function(a, b) {
    //     return Math.max(a, b);
    // });
    // navScoreDisplay.textContent = ` (Your Highest: ` + max + `)`
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
        t = (timer - timeElapsed) - timePenalty  

        if(t > 0){
            timeElapsed++
            quizTimeDisplay.textContent = t
            // console.log(`time remaining: ` + t + ` - time elapsed: ` + timeElapsed + ` - penalty: ` + timePenalty)
        } else {
            endGame()
        }

        // make the timer red when 10 seconds or under
        if(t <= 10){
            quizTimeDisplay.setAttribute(`style`, `color: red;`)
        }
    }, 1000)
}
function generateBtns(){
    // adding conditional to make sure it doesn't regenerate buttons when there are no questions left
    if(currentSet.length > 0){
        for(i=0;i<4;i++){
            var btn = document.createElement(`button`)
            btn.setAttribute(`type`, `button`)
            btn.setAttribute(`class`, `col-12 btn-grv p-0`)
            answerGroup.appendChild(btn)
        }
    
        answerBtns = answerGroup.querySelectorAll(`button`)

    } else {
        return
    }
}
function clearBtns(){
    for(i=0;i<4;i++){
        answerBtns[i].remove()
    }
}
function changeQuestion(){
    console.log(`inside changeQuestion`)
    console.log(`userAnswer is :` + userAnswer)
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
    } 

    qCount++
    qCountDisplay.textContent = `Q#: ` + qCount 
    var rand = Math.floor(Math.random()*questions.length) // generate random number 0 - questions length
    q = currentSet[rand]    // store random selected 
    qc = q.choices
    qcToDisplay = []

    // display randomly chosen question's title 
    questionText.textContent = q.title    

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
    currentSet.splice([rand],1)            
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
    timePenalty = timePenalty - 10
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
    timePenalty = timePenalty + 15
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

    // event.preventDefault()
    var el = event.target
    userAnswer = el.textContent
    console.log(`currentset length` + currentSet.length) 


    // just checking if button - in case i change CSS around it
    if(el.type === `button`){
        // checking to see if the selected button's text matches the question's answer
        if(userAnswer === q.answer){
            rightAnswer() 
        } else {
            wrongAnswer()               
        }           
    } else {
        return
    }        

    // after grading each answer we clear the buttons and generate new ones, to reset any formatting
    clearBtns()
    generateBtns()
    // go on to the next question
    changeQuestion()
  
}
function endGame(){
    clearInterval(interval)
    clearBtns()
    answerGroup.remove()
    gradeDisplay.remove()
    qCountDisplay.remove()
    centerDisplay.remove()

    if(t < 0){
        score = 0
    } else {
        score = t
    }
    
    quizTimeDisplay.textContent = `Final score: ` + score
    questionText.textContent = `please enter your initials: `
    input.setAttribute(`type`, `text`)
    input.setAttribute(`id`, `user-initials`)
    input.setAttribute(`name`, `user-initials`)
    button.setAttribute(`class`, `p-1`)
    button.setAttribute(`type`, `button`)
    button.setAttribute(`id`, `submit-button`)
    button.textContent = `submit`
    questionText.appendChild(input)
    questionText.appendChild(button)
    userInput = document.querySelector(`#user-initials`)
    submitBtn = document.querySelector(`#submit-button`)
}
function submitInitials(e){
    e.preventDefault()

    var keycode = e.keyCode
    // if keyup event is "enter" (keycode 13) then save input as initial and score in local storage
    if(keycode === 13){
        user.initials = userInput.value
        console.log(`keycode is: `+ keycode)

        // create a "thank you" confirmation p tag
        var para = document.createElement(`p`)
        // para.setAttribute(`class`, ``)
        para.setAttribute(`id`, `user-confirmation`)
        para.textContent = `Thank you for playing, ` + user.initials.toUpperCase() + `!`
        questionText.appendChild(para)
        
        // store initials in local storage
        localStorage.setItem(`stored-initials`, user.initials)
        
        // store score in local storage array
        storedScores.push(parseInt(score))
        localStorage.setItem(`stored-scores`, JSON.stringify(storedScores))
    } 
}

// listeners
playBtn.addEventListener(`click`, playQuiz)
brandLink.addEventListener(`click`, function(){
    window.location.reload(true);
})
answerGroup.addEventListener(`click`, gradeAnswer)
input.addEventListener(`keyup`, submitInitials)
// submitBtn.addEventListener(`click`, )

// pause, because
// highScoreLink.addEventListener(`click`, pauseTimer)


// ====
// WIP 
// ====

/*
// this doesn't work as i'd like it to

function randomize(arg1, arg2){
    for(i=qx.length;i>0;i--){
        var r = Math.floor(Math.random()*qx.length) // generate random number 0-length of argument (question/object set)
        genQx.push(qx[r])
        qx.splice([r], 1)
        newQx = genQx
    }
}
    */