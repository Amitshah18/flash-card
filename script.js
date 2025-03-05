document.addEventListener("DOMContentLoaded", () => {
    const flashcardsContainer = document.getElementById("flashcards");
    const addFlashcardBtn = document.getElementById("add-flashcard");
    const popup = document.getElementById("popup");
    const closePopupBtn = document.getElementById("close-popup");
    const saveFlashcardBtn = document.getElementById("save-flashcard");
    const questionInput = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

    let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

    // Load Dark Mode State
    if (localStorage.getItem("darkMode") === "enabled") {
        enableDarkMode();
    }

    toggleDarkModeBtn.addEventListener("click", () => {
        if (document.body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        toggleDarkModeBtn.innerText = "☀️ Light Mode";
    }

    function disableDarkMode() {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
        toggleDarkModeBtn.innerText = "🌙 Dark Mode";
    }

    function renderFlashcards() {
        flashcardsContainer.innerHTML = "";
        flashcards.forEach((flashcard, index) => {
            const card = document.createElement("div");
            card.classList.add("flashcard");
            card.draggable = true;
            card.setAttribute("ondragstart", `drag(event, ${index})`);
            card.innerHTML = `
                <p class="question">${flashcard.question}</p>
                <p class="answer" style="display:none;">${flashcard.answer}</p>
                <div class="flashcard-controls">
                    <button onclick="deleteFlashcard(${index})">❌</button>
                </div>
            `;
            card.addEventListener("click", () => {
                const question = card.querySelector(".question");
                const answer = card.querySelector(".answer");
                if (answer.style.display === "none") {
                    question.style.display = "none";
                    answer.style.display = "block";
                } else {
                    answer.style.display = "none";
                    question.style.display = "block";
                }
            });

            flashcardsContainer.appendChild(card);
        });
    }

    addFlashcardBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closePopupBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    saveFlashcardBtn.addEventListener("click", () => {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();

        if (question && answer) {
            flashcards.push({ question, answer });
            localStorage.setItem("flashcards", JSON.stringify(flashcards));
            questionInput.value = "";
            answerInput.value = "";
            popup.style.display = "none";
            renderFlashcards();
        }
    });

    renderFlashcards();
});

/* Drag & Drop Functionality */
function allowDrop(event) {
    event.preventDefault();
}

function drag(event, index) {
    event.dataTransfer.setData("text", index);
}

function drop(event) {
    event.preventDefault();
    const index = event.dataTransfer.getData("text");
    let flashcards = JSON.parse(localStorage.getItem("flashcards"));
    const movedCard = flashcards.splice(index, 1)[0];
    flashcards.push(movedCard);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    location.reload();
}

/* Delete Flashcard */
function deleteFlashcard(index) {
    let flashcards = JSON.parse(localStorage.getItem("flashcards"));
    flashcards.splice(index, 1);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    location.reload();
}
