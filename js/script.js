const navScoreDisplay = document.querySelector(`#hi-scr-display`)
const quizTimeDisplay = document.querySelector(`#time-display`)
const brandLink = document.querySelector(`#brand-link`)
const highScoreLink = document.querySelector(`#high-scores`)
const answerGroup = document.querySelector(`#answer-group`)
const gradeDisplay = document.querySelector(`#grade-display`)
const playBtnCat = document.querySelector(`#play-button-cat`)
const playBtnDog = document.querySelector(`#play-button-dog`)
const contColumn = document.querySelector(`#container-col`)
const navBar = document.querySelector(`#navbar`)
const qCountDisplay = document.querySelector(`#question-count`)
const centerDisplay = document.querySelector(`#center-display`)
const penDisplay = document.querySelector(`#penalty-display`)
// const closeBtn = document.querySelector(`#close-btn`)
const questionText = document.querySelector(`#question-text`)
const input = document.createElement(`input`)
const inputSubmit = document.createElement(`input`)
const inputText = document.createElement(`input`)
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
var userAnswer, hiScore, q, t;
var correct 
// var q     
// var t   // the ultimate time displayed and later stored as score
var submitBtn
var submit = 0
var storedScores = JSON.parse(localStorage.getItem(`stored-scores`))
var storedInitials = JSON.parse(localStorage.getItem(`stored-initials`))

// object for current and future user data
var user = {
    name: "",
    initials: "",
    scores: []
}

// var storedInfo = {
//     initials: [],
//     scores: [],    
// }

init()

function init(){
    brandLink.click()       // clicking button to open the modal which houses the welcome message and play button (restart the game)
    getLocalInfo()
}
function getLocalInfo(){
    
    if(storedScores === null){
        storedScores = []
    } else {
        storedScores = storedScores
        // find max of all stored scores in array
        hiScore = storedScores.reduce(function(a, b) {
            return Math.max(a, b);
        });
    }
       
    navScoreDisplay.textContent = `(Your Highest Score: ` + hiScore + `)`

    if(storedInitials === null){
        storedInitials = []
    } else {
        storedInitials = storedInitials
    }
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
            // bring back the clicking (pointer-event)
            answerGroup.setAttribute(`class`,`row btn-group-vertical answer-group w-100`)
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

    answerGroup.setAttribute(`class`,`row btn-group-vertical answer-group w-100 disable-click`) // disable click with CSS class (gotta be a better way)
    timePenalty = timePenalty - 11      // add time for delay in gradeAnswer()
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
    answerGroup.setAttribute(`class`,`row btn-group-vertical answer-group w-100 disable-click`) // disable click with CSS class (gotta be a better way)
    timePenalty = timePenalty + 14      // add time for delay in gradeAnswer()
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
    // timeout of 1sec to display right/wrong answer to user (via button background color)
    setTimeout(function(){
        // after grading each answer we clear the buttons and generate new ones, to reset any formatting
        clearBtns()
        generateBtns()
        // go on to the next question
        changeQuestion()

    },1000)
  
}
function endGame(event){
    // event.preventDefault()
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
    
    quizTimeDisplay.setAttribute(`style`, `font-color: white;`)
    quizTimeDisplay.textContent = `Final Score: ` + score
    questionText.textContent = `Please enter your initials: `
    inputText.setAttribute(`type`, `text`)
    inputText.setAttribute(`style`, `text-transform: uppercase`)
    inputText.setAttribute(`id`, `user-initials`)
    inputText.setAttribute(`name`, `user-initials`)
    inputText.setAttribute(`class`, `m-1 text-center`)
    inputText.setAttribute(`maxlength`, `3`)
    inputSubmit.setAttribute(`class`, `m-1`)
    inputSubmit.setAttribute(`type`, `submit`)
    inputSubmit.setAttribute(`id`, `submit-button`)
    inputSubmit.setAttribute(`value`, `Submit`)
    questionText.appendChild(inputText)
    questionText.appendChild(inputSubmit)
    // button.textContent = `submit`
    // questionText.appendChild(button)
    userInput = document.querySelector(`#user-initials`)
    submitBtn = document.querySelector(`#submit-button`)

    submitBtn.addEventListener(`click`, function(e){
        e.preventDefault()
        alert(`Currently non-functional\nplease press "enter" on your keyboard to submit`)
    })
    
    // generateReportCard()     

    hiScoreList()
    
}
function hiScoreList(){
    var div = document.createElement(`div`)
    div.setAttribute(`class`,``)
    div.setAttribute(`id`,`high-score-list`)
    div.setAttribute(`class`,`p-2`)
    div.textContent = `High Scores (earliest to latest): `
    questionText.appendChild(div)
    var highScoreDiv = document.querySelector(`#high-score-list`)

    // perhaps sort in descending order for display?
    for(i=0;i<storedScores.length;i++){
        var p = document.createElement(`p`)
        var icon = document.createElement(`i`)
        p.setAttribute(`class`,`text-center m-1`)
        p.setAttribute(`id`,`score-` + i)                  // tie ID to index
        icon.setAttribute(`class`, `fa fa-close mx-2`)
        // icon.setAttribute(`style`, `font-size:14px`)
        icon.setAttribute(`id`, `close-icon-` + i)
        icon.setAttribute(`title`, `close-icon`)
        p.textContent = storedInitials[i] + ` - ` + storedScores[i]
        highScoreDiv.appendChild(p)
        p.prepend(icon)
    }

    highScoreDiv.addEventListener(`click`, function(event){
        event.preventDefault()
        var el = event.target
        console.log(`element id is: ` + el.id)
        if(el.title === `close-icon`){
            alert(`You'd like to delete this record, wouldn't you?`)
        }
    })

}
function submitInitials(e){
    // e.preventDefault()
    user.initials = userInput.value.toUpperCase()
    console.log(submit)

    var keycode = e.keyCode
    // if keyup event is "enter" (keycode 13) then save input as initial and score in local storage
    if((keycode === 13) || (submit === 1)){
        console.log(`keycode is: `+ keycode)
            
        // add conditional not to add p, scores, and initials if p already created
        
        var para = document.createElement(`p`)                                  // create a "thank you" confirmation p tag
        para.setAttribute(`class`, `lead text-danger font-weight-bold`)
        para.setAttribute(`id`, `user-confirmation`)
        para.textContent = `Thank you for playing!`
        questionText.prepend(para)                                              // prepending to not mess with hi-score running list
        
        //  Want to append just submitted initials onto current hi-score list
        //  or supply "refresh button" if using a function to sort by highest score
        //


        localStorage.setItem(`last-user-initials`, user.initials)

        storedInitials.push(userInput.value.toUpperCase())
        localStorage.setItem(`stored-initials`, JSON.stringify(storedInitials)) // store initials in local storage array
        storedScores.push(parseInt(score))                                      // push score into working array storedScores
        localStorage.setItem(`stored-scores`, JSON.stringify(storedScores))     // store score in local storage array
        // console.log(`Your storedScores is: ` + storedScores)
    } 
}

// listeners
playBtnCat.addEventListener(`click`, playQuiz)
playBtnDog.addEventListener(`click`, function(){
    alert(`Coming Soon!`)
})
brandLink.addEventListener(`click`, function(){
    window.location.reload(true);
})
answerGroup.addEventListener(`click`, gradeAnswer)
inputText.addEventListener(`keyup`, submitInitials)


// questionText.addEventListener(`click`, function(e){
//     submit = 1
//     console.log(submit)
//     submitInitials()
// })

// shortcut to end screen, because
navScoreDisplay.addEventListener(`click`, endGame)