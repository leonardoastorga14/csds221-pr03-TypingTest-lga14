const paragraphs = [
    "In a distant galaxy, shrouded by the mystery of time and space, existed an advanced civilization. Intricate networks of gleaming cities spread across a dozen planets, unified under one banner. The civilization had mastered the art of traversing through space, their vessels frequently danced around the stars, observing and learning from the universe. They believed in the harmony of existence, and their wisdom was as boundless as the cosmos itself. Yet, they yearned for contact, for somewhere in the uncharted expanses, they hoped to find their cosmic brethren."
];

const typingTextElement = document.querySelector(".typing-text p");
const inputField = document.querySelector(".wrapper .input-field");
const tryAgainButton = document.querySelector(".content button");
const timeTagElement = document.querySelector(".timeLeft span b");
const errorTagElement = document.querySelector(".errors span");
const wpmTagElement = document.querySelector(".wpm span");
const cpmTagElement = document.querySelector(".cpm span");
const typingText = document.querySelector('.typing-text');

const maxTime = 60;
let timer;
let timeLeft = maxTime;
let characterIndex = 0;
let errors = 0;
let isTyping = false;

function loadRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    const randomParagraph = paragraphs[randomIndex];
    const characters = randomParagraph.split("");
    typingTextElement.innerHTML = characters.map(char => `<span>${char}</span>`).join("");
    typingTextElement.querySelectorAll("span")[0].classList.add("active");

    document.addEventListener("keydown", () => inputField.focus());
    typingTextElement.addEventListener("click", () => inputField.focus());
}

function startTyping() {
  const characters = typingText.querySelectorAll('span');
  const typedChar = inputField.value.slice(-1);

  if (characterIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(updateTimer, 1000);
      isTyping = true;
    }

    if (typedChar === characters[characterIndex].innerText) {
      characters[characterIndex].classList.add('correct');
      characterIndex++;
    } else if (typedChar !== '') {
      characters[characterIndex].classList.add('incorrect');
      errors++;
    }

    characters.forEach(span => span.classList.remove('active'));
    characters[characterIndex].classList.add('active');

    const wordsPerMinute = calculateWordsPerMinute(characterIndex, errors, maxTime, timeLeft);
    updateStats(wordsPerMinute, errors, characterIndex);
  } else {
    clearInterval(timer);
    inputField.blur();
  }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTagElement.innerText = timeLeft;
        const wordsPerMinute = calculateWordsPerMinute(characterIndex, errors, maxTime, timeLeft);
        wpmTagElement.innerText = wordsPerMinute;
    } else {
        stopTyping();
    }
}

function stopTyping() {
    clearInterval(timer);
    inputField.value = "";
}

function calculateWordsPerMinute(charactersTyped, errors, maxTime, timeLeft) {
    let wpm = Math.round(((charactersTyped - errors) / 5) / (maxTime - timeLeft) * 60);
    return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
}

function updateStats(wordsPerMinute, errors, charactersTyped) {
    wpmTagElement.innerText = wordsPerMinute;
    errorTagElement.innerText = errors;
    cpmTagElement.innerText = charactersTyped - errors;
}

function resetTest() {
    loadRandomParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    characterIndex = 0;
    errors = 0;
    isTyping = false;
    inputField.value = "";
    timeTagElement.innerText = timeLeft;
    wpmTagElement.innerText = 0;
    errorTagElement.innerText = 0;
    cpmTagElement.innerText = 0;
}

loadRandomParagraph();
inputField.addEventListener("input", startTyping);
tryAgainButton.addEventListener("click", resetTest);