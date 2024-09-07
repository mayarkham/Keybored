const words = 'in a quiet valley where clear streams flowed through green meadows a curious traveler named oliver started a journey his adventure began at sunrise as the golden light touched the hills and painted the sky with orange and pink holding a simple map oliver walked through thick forests with old oak trees and bright wildflowers he saw magical animals like graceful deer and sneaky foxes as well as big eagles flying high above each step took him closer to finding hidden secrets and old treasures he admired the patterns in nature the songs of birds and the gentle noise of leaves his route led him through busy towns where people made beautiful pottery and jewelry he tried new foods met different people and had interesting talks with locals olivers trip was more than just a physical journey it was a deep look into the human spirit and the amazing beauty of the world he found that every meeting and every moment was a gift in itself adding to the rich story of his adventure as the sun went down behind the mountains casting long shadows over the land oliver thought about the many wonders he had seen feeling thankful for the incredible experiences that had made his life richer'.split(' ');
const wordsCount = words.length;
const timer30 = 30 * 1000;
const timer60 = 60 * 1000;
let gameTime = timer30;
let gameStart = null;
let timer = null;

function updateGameTime() {
    if (thirtyoption.classList.contains('selected')) {
        gameTime = timer30; // 30 seconds
    } else if (sixtyoption.classList.contains('selected')) {
        gameTime = timer60; // 60 seconds
    }
}

const thirtyoption = document.getElementById('thirty');
const sixtyoption = document.getElementById('sixty');

// Default 30 seconds on load screen
thirtyoption.classList.add('selected');
thirtyoption.classList.remove('unselected');
sixtyoption.classList.add('unselected');
sixtyoption.classList.remove('selected');

thirtyoption.addEventListener('click', function() {
    thirtyoption.classList.add('selected');
    thirtyoption.classList.remove('unselected');
    sixtyoption.classList.remove('selected');
    sixtyoption.classList.add('unselected');
    updateGameTime();
});

sixtyoption.addEventListener('click', function() {
    sixtyoption.classList.add('selected');
    sixtyoption.classList.remove('unselected');
    thirtyoption.classList.remove('selected');
    thirtyoption.classList.add('unselected');
    updateGameTime();
});

function addClass(el, name) {
    if (el) {
        el.classList.add(name);
    } else {
        console.error('Element is null or undefined:', el);
    }
}

function removeClass(el, name) {
    if (el) {
        el.classList.remove(name);
    } else {
        console.error('Element is null or undefined:', el);
    }
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCount);
    return words[randomIndex];
}

function formatWord(word) {
    return `<div class="word">
        <span class="letter">${word.split('').join('</span><span class="letter">')}</span>
    </div>`;
}

function newGame() {
    
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord ? firstWord.querySelector('.letter') : null;
    addClass(firstWord, 'current');
    if (firstLetter) {
        addClass(firstLetter, 'current');
    }
    document.getElementById('info').innerHTML=(gametime/1000)+'';
    
    clearInterval(timer);
    timer = null;

}
function getwpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);

    // Filter out only the correct words
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });

    // Convert game time (in milliseconds) to minutes
    const minutesGameTime = gameTime / 60000; // 30,000 ms -> 0.5 minutes or 60,000 ms -> 1 minute

    // Calculate WPM: correctWords.length / minutes
    const wpm = (correctWords.length / minutesGameTime) // WPM with 2 decimal places

    return wpm;
}



function gameOver() {
    clearInterval(timer); // Clear the game timer
    addClass(document.getElementById('game'), 'over');
    const result = getwpm(); // Get the calculated WPM
    //document.getElementById('info').innerHTML = `WPM: ${result}`;
    document.getElementById('info').innerHTML = `<span style="font-size: 3rem;font-family: impact; font-weight: normal;margin-right: 10px;">WPM</span> <span style="font-size: 3rem;font-family: impact; font-weight:normal ; color: white;">${Math.round(result)}</span>`;}


    document.getElementById('game').addEventListener('keyup', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.word.current');
        const currentLetter = document.querySelector('.letter.current');
        const expected = currentLetter ? currentLetter.textContent.trim() : '';
    
        const isLetter = key.length === 1 && key !== ' ';
        const isSpace = key === ' ';
        const isBackspace = key === 'Backspace';
        const isFirstLetter = currentLetter === currentWord?.firstChild;
    
        if (document.getElementById('game').classList.contains('over')) {
            return;
        }
    
        if (!timer && isLetter) {
            timer = setInterval(() => {
                if (!gameStart) {
                    gameStart = Date.now();
                }
                const elapsed = Date.now() - gameStart;
                const secLeft = Math.round((gameTime - elapsed) / 1000);
                if (secLeft < 0) {
                    gameOver();
                    return;
                }
                document.getElementById('info').innerText = secLeft;
            }, 1000);
        }
    
        if (isLetter) {
            if (currentLetter) {
                addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
                removeClass(currentLetter, 'current');
                if (currentLetter.nextElementSibling) {
                    addClass(currentLetter.nextElementSibling, 'current');
                }
            } else {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerText = key;
                incorrectLetter.className = 'letter incorrect extra';
                currentWord?.appendChild(incorrectLetter);
            }
        }
    
        const isExtra = document.querySelector(".letter.incorrect.extra");
        console.log('Extra letter present:', isExtra);
    
        if (isBackspace) {
            if (isExtra) {
                currentWord.removeChild(isExtra);
            }
            if (currentLetter && isFirstLetter) {
                removeClass(currentWord, 'current');
                const prevWord = currentWord.previousElementSibling;
                if (prevWord && prevWord.classList.contains('word')) {
                    addClass(prevWord, 'current');
                    const lastLetter = prevWord.querySelector('.letter:last-child');
                    if (lastLetter) {
                        addClass(lastLetter, 'current');
                        removeClass(lastLetter, 'incorrect');
                        removeClass(lastLetter, 'correct');
                    }
                }
            } else if (currentLetter) {
                removeClass(currentLetter, 'current');
                const prevLetter = currentLetter.previousElementSibling;
                if (prevLetter) {
                    addClass(prevLetter, 'current');
                    removeClass(prevLetter, 'incorrect');
                    removeClass(prevLetter, 'correct');
                }
            } else {
                if (currentWord) {
                    const lastLetter = currentWord.querySelector('.letter:last-child');
                    if (lastLetter) {
                        addClass(lastLetter, 'current');
                        removeClass(lastLetter, 'incorrect');
                        removeClass(lastLetter, 'correct');
                    }
                }
            }
        }
    
        if (currentWord && currentWord.getBoundingClientRect().top > 250) {
            const words = document.getElementById('words');
            const margin = parseInt(words.style.marginTop || '0px');
            words.style.marginTop = (margin - 35) + 'px';
        }
    
        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
                lettersToInvalidate.forEach(letter => addClass(letter, 'incorrect'));
            }
    
            if (currentWord) {
                removeClass(currentWord, 'current');
                const nextWord = currentWord.nextElementSibling;
                if (nextWord && nextWord.classList.contains('word')) {
                    addClass(nextWord, 'current');
                    const firstLetter = nextWord.querySelector('.letter');
                    if (firstLetter) {
                        addClass(firstLetter, 'current');
                    } else {
                        console.error('First letter not found in new current word');
                    }
                }
            }
    
            if (currentLetter) {
                removeClass(currentLetter, 'current');
            }
        }
    
        // Move cursor
        const nextLetter = document.querySelector('.letter.current');
        const nextWord = document.querySelector('.word.current');
        const cursor = document.getElementById('cursor');
        if (nextLetter) {
            cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
            cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        } else if (nextWord) {
            cursor.style.top = nextWord.getBoundingClientRect().top + 2 + 'px';
            cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
        }
        
        console.log({ key, expected });
    });
    
document.getElementById('newGame').addEventListener('click', () => {
    // Refresh the page
    location.reload();
});

newGame();
