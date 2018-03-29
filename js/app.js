/*
 * Create a list that holds all of your cards
 */
var deck = document.querySelector('.deck');
var cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bomb", "fa-bicycle", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bomb", "fa-bicycle"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// shuffle the cards
var shuffledCards = shuffle(cards);

// build the deck
var allTheCards = shuffledCards.map((card, index) => `
<section class="container">
    <div class="card" id="${index}-${card}">
        <figure class="front"></figure>
        <figure class="back">
            <i class="fa ${card}"></i>
        </figure>
    </div>
</section>
`).join(" ");

// append shuffled deck to html
deck.innerHTML = allTheCards;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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

var shownCardsList = [];
var regex = /\d+-/;

// set up the event listener for a card. If a card is clicked:
deck.addEventListener('click', function (e) {
    // script will run if element clicked is a valid card
    var isValidCard = cardCheck(e.target);
    if(isValidCard) {
        var currentCard = e.target;
        // display the card's symbol
        showCard(currentCard);
        // add the card to a *list* of "open" cards
        addShownCard(currentCard);
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
    }
});

function showCard(card) {
    card.parentElement.classList.add("flipped");
}

function addShownCard(card) {
    // get card id
    var cardId = card.parentElement.id;
    // extract card name from id
    var cardName = cardId.replace(regex, "");
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
        matchedParent.classList.add("matched");
    }
    // clear the card list
    shownCardsList = [];
}

function hideCards() {
    // clear the card list
    shownCardsList = [];
    // remove flipped class from unmatching cards
    var allFlippedCards = document.querySelectorAll('.flipped');
    for (let card of allFlippedCards) {
        if (!card.classList.contains('matched')) {
            setTimeout(function() {
                card.classList.remove("flipped");
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