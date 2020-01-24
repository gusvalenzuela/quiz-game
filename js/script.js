const navAvgScoreDisplay = document.querySelector(`#avg-scr-display`)
const quizTimeDisplay = document.querySelector(`#time-display`)
const brandLink = document.querySelector(`#brand-link`)
const highScoreLink = document.querySelector(`#high-scores`)
const answerGroup = document.querySelector(`#answer-group`)
const gradeDisplay = document.querySelector(`#grade-display`)
const answerBtns = answerGroup.querySelectorAll(`button`)
const playBtn = document.querySelector(`#play-button`)
const contColumn = document.querySelector(`#container-col`)
const navBar = document.querySelector(`#navbar`)
// const closeBtn = document.querySelector(`#close-btn`)
const questionText = document.querySelector(`#question-text`)
var timesPlayed = 0     // to show on navBar
var timer = 99
var timeElapsed = 0
var timePenalty = 0
var currentSet = []
var interval
var score   
var q     
var t   // the ultimate time displayed and later stored as score
// function wait(){w = setInterval(function(){},250)} // at one point i wanted to add a splash between questions

init()

function init(){
    const qs = questions
    clear()
    brandLink.click()       // clicking button to open the modal which houses the welcome message and play button (need to move the click elsewhere)

    // randomizing the order of questions shown each time the page is loaded
    for(i=qs.length;i>0;i--){
        var r = Math.floor(Math.random()*qs.length) // generate random number 0-length of Questions Object
        currentSet.push(qs[r])      // pushing question from Questions Object at random (r) index to CurrentSet var
        qs.splice([r], 1)           // removing question from working set (until there are none left to grab)
    }
    console.log(currentSet)
}
// function to clear time and text displayed 
function clear(){
    timePenalty = 0
    timeElapsed = 0
    questionText.textContent = ""
    answerBtns.textContent = ""
    quizTimeDisplay.textContent = ""
}
function startTimer(){  
    interval = setInterval(function(){   
        t = (timer - timeElapsed) - timePenalty   
        if(t >= 0){
            timeElapsed++
            quizTimeDisplay.textContent = t
            // console.log(`time remaining: ` + t + ` - time elapsed: ` + timeElapsed + ` - penalty: ` + timePenalty)
        } 
    }, 1000)
}
function changeQuestion(){  
    var rand = Math.floor(Math.random()*questions.length) // generate random number 0 - questions length
    q = currentSet[rand]    // store random selected 
    qc = q.choices
    qcToDisplay = []
    // console.log(`length of current question set is: ` + currentSet.length)
    console.log(q)

    // i'm missing something obvious in this conditional but i haven't figured it out
    if(currentSet.length > 1){
        // display randomly chosen question title 
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
    } else {
        clearInterval(interval)
        score = t
        alert(`GAME OVER\nYour Score is: ` + score)
    }
}
function playQuiz() {
    clear()
    startTimer()
    changeQuestion()
    console.log(`Let's play!`)
}
function gradeAnswer(event){
    // event.preventDefault()
    var el = event.target

    // just checking if button - in case i change CSS
    if(el.type === `button`){
        if(el.textContent === q.answer){
            gradeDisplay.textContent = `Correct!`
            gradeDisplay.setAttribute(`class`, `col-12 lead text-success`)
        } else {
            gradeDisplay.textContent = `Incorrect`
            gradeDisplay.setAttribute(`class`, `col-12 lead text-danger`)
            // trying to avoid subtracting from <15 which stops the timer
            if((timer - timeElapsed) >= 15){
                timePenalty = timePenalty + 15
            }
        }
    } else {
        return
    }    
    changeQuestion()
}

// listeners
playBtn.addEventListener(`click`, playQuiz)
answerGroup.addEventListener(`click`, gradeAnswer)


// pause, because
highScoreLink.addEventListener(`click`, pauseTimer)


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