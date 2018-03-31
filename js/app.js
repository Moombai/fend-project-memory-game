// Select DOM elements
const deck = document.querySelector('.deck');
const restartButton = document.getElementById('restart');
const modal = document.getElementById('myModal');
const modalSpan = document.getElementById("close");

// Set variables to track time played, cards revealed and moves made
let renderTime;
let shownCardsList = [];
const regex = /\d+-/;
const player = {
    moves: 0,
    makeMove: function () { player.moves += 1 },
    stopwatch: 'off',
    timePlayed: 0
};

// Shuffle the cards
const cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bomb', 'fa-bicycle', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bomb', 'fa-bicycle'];
const shuffledCards = shuffle(cards);

// Display shuffled cards
const renderCardHTML = shuffledCards.map((card, index) => `
<section class="container">
    <div class="card" id="${index}-${card}">
        <figure class="front"></figure>
        <figure class="back">
            <i class="fa ${card}"></i>
        </figure>
    </div>
</section>
`).join(' ');
deck.innerHTML = renderCardHTML;

/** Global Event Listeners **/
// restart game
restartButton.addEventListener('click', function () { window.location.reload(); })

// When the user clicks on <span> (x), close the modal
modalSpan.addEventListener('click', function () {
    modal.style.display = 'none';
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// set up the event listener for a card. If a card is clicked:
deck.addEventListener('click', function (e) {
    // script will run if element clicked is a valid card
    const isValidCard = cardCheck(e.target);
    if(isValidCard) {
        // start the clock!
        startTimer();
        const currentCard = e.target;
        // display the card's symbol
        showCard(currentCard);
        // add the card to a *list* of "open" cards
        addShownCard(currentCard);
        // increment the move counter and display it on the page
        updateMoveCounter();

        // if the shownCardsList contains two cards
        if (shownCardsList.length > 1) {
            // check to see if the two cards match
            if (shownCardsList[0] === shownCardsList[1]) {
            // if the cards do match, lock the cards in the open position
                addMatchedClass(shownCardsList[0]);
            } else {
                console.log("cards do not match!");
                // if the cards do not match, remove the cards from the list and hide the card's symbol
                hideCards();
            }
        }
        updateStarDisplay();
        // if all cards have matched, display a message with the final score
        checkAllCardsMatch();
    }
});

function showCard(card) {
    card.parentElement.classList.add('flipped');
}

function addShownCard(card) {
    // get card id
    const cardId = card.parentElement.id;
    // extract card name from id
    const cardName = cardId.replace(regex, '');
    // add card name to shown cards list
    shownCardsList.push(cardName);
    console.log(shownCardsList);
}

function addMatchedClass(matched){
    let matchedCards = document.querySelectorAll('.' + matched);
    // get the parent card element of matched card
    // add a class of matched
    for (let card of matchedCards) {
        let matchedParent = card.closest('.card');
        matchedParent.classList.add('matched');
    }
    // clear the card list
    shownCardsList = [];
}

function hideCards() {
    // clear the card list
    shownCardsList = [];
    // remove flipped class from unmatching cards
    const allFlippedCards = document.querySelectorAll('.flipped');
    for (let card of allFlippedCards) {
        if (!card.classList.contains('matched')) {
            setTimeout(function() {
                card.classList.remove('flipped');
            }, 1000);
        }
    }
}

function cardCheck(element) {
    // Check if element clicked is a card and hasn't already been flipped
    if (element.closest('.card') && (!element.closest('.card').classList.contains('flipped'))) {
        console.log("Is a valid card");
        return true;
    } else {
        console.log("Not a valid card");
        return false;
    }
}

function updateMoveCounter() {
    const moveCounter = document.getElementById('moves');
    player.makeMove();
    const moves = player.moves;
    if (moves === 1) {
        moveCounter.textContent = moves + ' move';
    } else {
        moveCounter.textContent = moves + ' moves';
    }
}

function checkAllCardsMatch() {
    const matchingCards = document.querySelectorAll('.matched');
    if (matchingCards.length === 16) {
        const modalTime = document.getElementById('modal-time');
        modalTime.innerHTML =  player.timePlayed;
        modal.style.display = 'block';
        clearInterval(renderTime);
    }
}

function updateStarDisplay() {
    const moveCount = player.moves;
    const starDisplay = document.querySelector('.stars');

    if (moveCount === 30 || moveCount === 55 ) {
        const starElement = document.querySelector('.stars li');
        starDisplay.removeChild(starElement);
        // update display for modal stars
        const modalStars = document.querySelector('.modal-stars');
        const modalStarsChild = document.querySelector('.modal-stars li');
        modalStars.removeChild(modalStarsChild);
    }
}

function startTimer() {
    const clockStarted = player.stopwatch;
    // ensure that timer is only initialized once
    if (clockStarted === 'off') {
        player.stopwatch = 'on';
        const gameTimer = document.querySelector('.timer span');
        const start = moment();
        // update global variable renderTime
        renderTime = setInterval(function () {
            const timeSinceStart = moment(moment() - start).format('mm:ss');
            gameTimer.textContent = timeSinceStart;
            player.timePlayed = timeSinceStart;
        }, 1000);
    }
}