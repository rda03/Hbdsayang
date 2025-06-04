document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    // Select all necessary elements from the DOM to interact with them.
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    const errorMessage = document.getElementById('errorMessage');
    // const envelopeContainer = document.getElementById('envelopeContainer'); // Not directly manipulated, but part of the structure
    const letterContent = document.getElementById('letterContent');
    const submitBtn = document.getElementById('submitBtn');
    const continueBtn = document.getElementById('continueBtn');
    const introTexts = document.querySelectorAll('.intro-text'); // Get all intro text paragraphs
    const inputArea = document.querySelector('.input-area'); // The container for the input field and question
    const envelopeWrapper = document.querySelector('.envelope-wrapper'); // The main envelope container for class-based animations

    // --- Configuration ---
    // The name required to "unlock" the letter.
    // Stored in uppercase for case-insensitive comparison.
    const correctName = "TIKA YUNIARTIWI";
    const envelopeFlapOpenDuration = 500; // Corresponds to --transition-duration in CSS (0.5s)
    const letterRevealDelayAfterFlap = 100; // Small delay after flap starts opening to reveal letter
    const letterAnimationDuration = 800; // Corresponds to letter-content transform animation (0.8s)
    const elementHideDuration = 500; // Duration for intro text and form to hide (0.5s)

    // --- Initial Page Animations ---
    // Animate the introductory text elements into view with a staggered delay.
    introTexts.forEach((text, index) => {
        text.style.animation = `fadeInUp 0.8s ${0.2 + index * 0.4}s ease-out forwards`;
    });

    // Animate the input area into view after the intro texts have appeared.
    const inputAreaDelay = 0.2 + introTexts.length * 0.4 + 0.3;
    inputArea.style.animation = `fadeInUp 0.8s ${inputAreaDelay}s ease-out forwards`;


    // --- Form Submission Handler ---
    // Listen for the submit event on the name form.
    nameForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission (which would reload the page).

        const enteredName = nameInput.value.trim().toUpperCase(); // Get, trim, and uppercase the entered name.

        // Check if the entered name matches the correct name.
        if (enteredName === correctName) {
            // --- Correct Name Entered: Success Path ---

            // 1. Clear any previous error messages and styles.
            errorMessage.classList.remove('show');
            envelopeWrapper.classList.remove('error'); // Ensure envelope is not styled as an error.

            // 2. Disable input and button to prevent multiple submissions or changes.
            submitBtn.disabled = true;
            nameInput.disabled = true;

            // 3. Hide intro texts and the input form to make space for the letter.
            // These animations will run for `elementHideDuration`.
            introTexts.forEach(text => {
                text.classList.add('fade-out-collapse');
            });
            inputArea.classList.add('form-collapse-hide');

            // Wait for hide animations to largely complete before proceeding with envelope,
            // or let them run concurrently if preferred. Here, we allow some overlap.
            // A small delay to ensure these start before the envelope fully opens.
            await new Promise(resolve => setTimeout(resolve, 100));


            // 4. Open the envelope flap.
            envelopeWrapper.classList.add('open'); // This triggers the CSS transition for the flap.

            // 5. Animate the letter out after the flap starts opening.
            // Wait for a significant portion of the flap animation before showing the letter.
            await new Promise(resolve => setTimeout(resolve, envelopeFlapOpenDuration - letterRevealDelayAfterFlap));

            letterContent.style.zIndex = 5; // Bring letter to the front.
            envelopeWrapper.classList.add('show-letter'); // Trigger letter visibility and its entrance animation.

            // 6. Wait for the letter animation to finish, then show the "Continue" button.
            await new Promise(resolve => setTimeout(resolve, letterAnimationDuration));

            continueBtn.classList.add('show'); // Make the continue button visible and animate it in.

        } else {
            // --- Incorrect Name Entered: Error Path ---

            // 1. Indicate an error on the envelope.
            envelopeWrapper.classList.add('error'); // Turn envelope red.
            errorMessage.textContent = "Maaf, halaman ini hanya untuk seseorang yang sangat spesial.";
            errorMessage.classList.add('show'); // Display the error message.

            // 2. Trigger a shake animation on the envelope for visual feedback.
            envelopeWrapper.classList.add('shake');
            setTimeout(() => {
                envelopeWrapper.classList.remove('shake');
                // Optionally, remove 'error' class after shake or on next input
                // envelopeWrapper.classList.remove('error');
            }, 300); // Duration of the shake animation in CSS is 0.3s.

            // 3. Clear the input field and refocus for another attempt.
            nameInput.value = '';
            nameInput.focus();
        }
    });

    // --- Continue Button Handler ---
    // Listen for clicks on the "Continue" button.
    continueBtn.addEventListener('click', () => {
        // Redirect the user to the next page.
        window.location.href = 'opening.html';
    });

    // --- Input Field Interaction ---
    // Hide error message and reset envelope error state when the user starts typing again.
    nameInput.addEventListener('input', () => {
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
        if (envelopeWrapper.classList.contains('error')) {
            envelopeWrapper.classList.remove('error'); // Remove red color from envelope
        }
    });
});