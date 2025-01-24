document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let hasAnswered = false;
    let answersLocked = false;

    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const actionBtn = document.getElementById('action-btn');
    const redoBtn = document.getElementById('redo-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const loading = document.getElementById('loading');

    async function fetchQuestions() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results;
            displayQuestion();
        } catch (error) {
            loading.textContent = 'Failed to load questions. Please try again later.';
            loading.style.color = '#dc3545';
        }
    }

    function displayQuestion() {
        loading.style.display = 'none';
        questionContainer.style.display = 'block';
        document.querySelector('.controls').style.display = 'flex';
        actionBtn.textContent = 'Next Question';
        actionBtn.classList.remove('submit');
        actionBtn.classList.add('next');
        
        const question = questions[currentQuestionIndex];
        let optionsHtml = '';

        question.incorrect_answers.forEach((option, index) => {
            optionsHtml += `
                <div class="option">
                    <input type="radio" name="quiz-option" value="${option}" id="option${index}">
                    <label for="option${index}">${option}</label>
                </div>
            `;
        });

        optionsHtml += `
            <div class="option">
                <input type="radio" name="quiz-option" value="${question.correct_answer}" id="option${question.incorrect_answers.length}">
                <label for="option${question.incorrect_answers.length}">${question.correct_answer}</label>
            </div>
        `;

        questionContainer.innerHTML = `
            <h2>${question.question}</h2>
            ${optionsHtml}
        `;
    }

    function lockAnswers() {
        document.querySelectorAll('input[name="quiz-option"]').forEach(option => {
            option.disabled = true;
        });
    }

    function checkAnswer() {
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        if (selectedOption) {
            const answer = selectedOption.value;
            if (answer === questions[currentQuestionIndex].correct_answer) {
                selectedOption.nextElementSibling.classList.add('correct');
                score++;
            } else {
                selectedOption.nextElementSibling.classList.add('incorrect');
                const correctOption = Array.from(document.querySelectorAll('input[name="quiz-option"]')).find(option => option.value === questions[currentQuestionIndex].correct_answer);
                correctOption.nextElementSibling.classList.add('correct');
            }
            hasAnswered = true;
            answersLocked = true;
            lockAnswers();
            actionBtn.textContent = 'Submit';
            actionBtn.classList.add('submit');
            actionBtn.classList.remove('next');
        }
    }

    function showResult() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        redoBtn.style.display = 'inline-block';
        resultContainer.innerHTML = `<h2>Your score: ${score} out of ${questions.length}</h2>`;
    }

    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        hasAnswered = false;
        answersLocked = false;
        questionContainer.style.display = 'block';
        resultContainer.style.display = 'none';
        redoBtn.style.display = 'none';
        loading.style.display = 'block';
        loading.textContent = 'Loading questions...';
        fetchQuestions();
    }

    actionBtn.addEventListener('click', () => {
        if (answersLocked) {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion();
                hasAnswered = false;
                answersLocked = false;
            } else {
                showResult();
                actionBtn.style.display = 'none';
            }
        } else {
            checkAnswer();
        }
    });

    redoBtn.addEventListener('click', resetQuiz);

    darkModeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    fetchQuestions();
});
