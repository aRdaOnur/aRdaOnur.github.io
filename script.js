'use strict'; 
// declaring variables
const closedCardEl = document.querySelector('.card-abs');
const cardsEl = document.querySelectorAll('.card');
const heartEl = document.querySelector('.heart');
let brokenHearts = 0;
const scoreEl = document.querySelector('.score');
let score = 0;
let isGamenotFinished = true; // if the game has finished, we can't press to any button.

const play_btn = document.getElementById('play');
const messageEl = document.querySelector('.message');
let countOfCorrect = 0; // if count of correct will equal to 4, new game will start.



// all cards will go in to cards list 
let cards = [];
for (let i = 0; i < cardsEl.length; i++) {
    cards.push(cardsEl[i])
}

// to close cards
function closeCards () {
    for (let i = 0; i < 9; i++) {
        cards[i].src = './leopard/picture-9.jpg';
    }
}


// shuffledList will shuffled and we use 
// when we shuffle the photos 
let shuffledList = [0,1,2,3,4,5,6,7,8];
function shuffleCards() {
    for (let i = 8; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
        [cards[i].src, cards[j].src] = [cards[j].src, cards[i].src];
    }
}
// 


let fourCards = [];// fourCards will store 4 cards and they will be opened  
// and we'll try to find these cards
function open4Cards() {
    let numbers = [];
    while (numbers.length < 4) {
        let randomNumber = Math.floor(Math.random() * 9);
        
        if (numbers.indexOf(randomNumber) === -1) {// if it is not in numbers list we are going to add it 
            numbers.push(randomNumber);
        }
    }
    
    // to open selected cards and we are going to change their src attribute.
    for (let i = 0; i < numbers.length; i++) {
        cards[numbers[i]].src = `./leopard/picture-${shuffledList[numbers[i]]}.jpg`;
        fourCards.push(shuffledList[numbers[i]])
    }
}

// the index of the searchingNumber in the shuffled list 
// that is what am i looking for 
function findInShuffledList(searchingNumber) {
    for (let i = 0; i < shuffledList.length; i ++) {
        if (shuffledList[i] == searchingNumber) {
            return i;
        }
    }

}

// to clean cards' borders
function cleanBorder() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('correct-card');
        cards[i].classList.remove('false-card');
        cards[i].classList.remove('real-cards');
    }
}

// to open all of the cards
function openCards() {
    for (let i = 0; i < shuffledList.length; i++) {
        cards[i].src = `./leopard/picture-${shuffledList[i]}.jpg`;   
    }
}

// if press the play button 
play_btn.addEventListener('click', function() {

    // the game'll start and button's textContent will change
    // if count of correct is equal to 4 the round will end
    // next round will start
    play_btn.textContent = 'Play';
    isGamenotFinished = true;
    countOfCorrect = 0;
    // update message 
    messageEl.textContent = '';
    messageEl.classList.remove('message-lose');
    messageEl.classList.remove('message-win');
    
    // to clear borders
    cleanBorder();

    // if our hearts have broken the game will end 
    if (heartEl.textContent == '🖤🖤🖤') {
        heartEl.textContent = '❤️❤️❤️'
        score = 0;
        brokenHearts = 0;
    }
    // remove opened cards from fourCards list
    fourCards = [];

    // the timer in the game 
    const timerEl = document.querySelector('.timer');
    function timer(){
        let sec = 3;
        // the cards will 
        // shuffle close and the 4 cards will open 
        shuffleCards();
        closeCards();
        open4Cards();

        if (sec > 0) { 
            
            let timer = setInterval(function(){
                
                // the timer will showed on screen 
                timerEl.innerHTML = sec;
                sec--;
                
                if (sec < 0) {

                    shuffleCards();
                    openCards();
                    clearInterval(timer);
                    clickEvent(); // we can click the cards
                    wasClickEventnotCalled = false;// to prevent add more than one 'addEventListener' to card elements 
                }
            }, 1000);
        }
    }
    timer();

});

let wasClickEventnotCalled = true;// to prevent add more than one 'addEventListener' to card elements 


function clickEvent() {

    if (wasClickEventnotCalled) {// to prevent add more than one 'addEventListener' to card elements 
        // to add 'addEventListene' to every card elements
        // which are in the cards list 
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function () {
                if (isGamenotFinished) {

                    let number = findInShuffledList(shuffledList[i]);
                    if (fourCards.includes(shuffledList[i])) {
                        // if choosed card is correct


                        // to remove the correct card in the fourCards list
                        fourCards.splice(fourCards.indexOf(shuffledList[i]),1)// if it is in list it'll removed
                        
                        
                        // card's border will be green  
                        cards[number].classList.add('correct-card');


                        score += 10;
                        countOfCorrect += 1;
    
                        if (countOfCorrect == 4) {
                            isGamenotFinished = false;
                            play_btn.textContent = 'Next ➡️';
                            messageEl.classList.add('message-win');
                            messageEl.textContent = 'You Won!!';
                        }
                    } else {
                        // if the choosed card is not correct 
                        
                        cards[number].classList.add('false-card')

                        score -= 10;                        
                        brokenHearts +=1;

                        // if broken hearts is equal to 3 the game will finish
                        if (brokenHearts == 3) {

                            play_btn.textContent = 'Play Again ❤️‍🩹';
                            isGamenotFinished = false;
                            messageEl.classList.add('message-lose');
                            messageEl.textContent = 'You lost!!'
                            // to clear borders
                            cleanBorder();
                            
                            // to show correct cards 
                            for (let i = 0; i < fourCards.length; i++) {
                                let newNumber = findInShuffledList(fourCards[i]);
                                cards[newNumber].classList.add('real-cards');
                            }
                            heartEl.textContent = '🖤🖤🖤';
                            score =  0;
    
                        } else if (brokenHearts == 2) {
                            heartEl.textContent = '❤️🖤🖤';
    
                        } else if (brokenHearts == 1) {
                            heartEl.textContent = '❤️❤️🖤';
                        }
                    }
                    scoreEl.textContent = score;
                }
            });
        }
    }
}