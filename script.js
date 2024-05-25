document.getElementById('submit-survey').addEventListener('click', function() {
    let fullName = document.getElementById('fullName').value.trim();
    let email = document.getElementById('email').value.trim();
    let dob = document.getElementById('dob').value;
    let contactNumber = document.getElementById('contactNumber').value.trim();
    let favoriteFood = document.querySelector('input[name="favoriteFood"]:checked');
    let movie = document.querySelector('input[name="movie"]:checked');
    let radio = document.querySelector('input[name="radio"]:checked');
    let eatOut = document.querySelector('input[name="eat_out"]:checked');
    let tv = document.querySelector('input[name="tv"]:checked');

    if (!fullName || !email || !dob || !contactNumber || !favoriteFood || !movie || !radio || !eatOut || !tv) {
        alert('Please fill in all fields and make sure all rating questions are answered.');
        return;
    }

    let age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 5 || age > 120) {
        alert('Please enter a valid age between 5 and 120.');
        return;
    }

    // Save survey data to local storage
    let surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push({
        fullName: fullName,
        email: email,
        dob: dob,
        contactNumber: contactNumber,
        favoriteFood: favoriteFood.value,
        movie: movie.value,
        radio: radio.value,
        eatOut: eatOut.value,
        tv: tv.value
    });
    localStorage.setItem('surveys', JSON.stringify(surveys));

    alert('Survey submitted successfully!');
    document.getElementById('survey-form').reset();
    document.getElementById('fill-out-survey-link').scrollIntoView();
});

document.getElementById('view-survey-results-link').addEventListener('click', function() {
    let mainContent = document.getElementById('main-content');
    let surveyResults = document.getElementById('survey-results');
    let surveys = JSON.parse(localStorage.getItem('surveys')) || [];

    if (surveys.length === 0) {
        surveyResults.innerHTML = '<p>No Surveys Available.</p>';
    } else {
        let totalSurveys = surveys.length;
        let totalAge = 0;
        let oldestPerson = null;
        let youngestPerson = null;
        let pizzaLovers = 0;
        let pastaLovers = 0;
        let papAndWorsLovers = 0;
        let movieRatings = [];
        let radioRatings = [];
        let eatOutRatings = [];
        let tvRatings = [];

        let ratingMapping = {
            'Strongly Agree': 5,
            'Agree': 4,
            'Neutral': 3,
            'Disagree': 2,
            'Strongly Disagree': 1
        };

        surveys.forEach(survey => {
            let age = new Date().getFullYear() - new Date(survey.dob).getFullYear();
            totalAge += age;
            if (oldestPerson === null || age > oldestPerson) oldestPerson = age;
            if (youngestPerson === null || age < youngestPerson) youngestPerson = age;
            if (survey.favoriteFood === 'Pizza') pizzaLovers++;
            if (survey.favoriteFood === 'Pasta') pastaLovers++;
            if (survey.favoriteFood === 'Pap and Wors') papAndWorsLovers++;

            movieRatings.push(ratingMapping[survey.movie]);
            radioRatings.push(ratingMapping[survey.radio]);
            eatOutRatings.push(ratingMapping[survey.eatOut]);
            tvRatings.push(ratingMapping[survey.tv]);
        });

        let averageAge = (totalAge / totalSurveys).toFixed(1);
        let pizzaPercentage = ((pizzaLovers / totalSurveys) * 100).toFixed(1);
        let pastaPercentage = ((pastaLovers / totalSurveys) * 100).toFixed(1);
        let papAndWorsPercentage = ((papAndWorsLovers / totalSurveys) * 100).toFixed(1);

        let averageRating = (ratings) => (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1);

        surveyResults.innerHTML = `
            <h2>Survey Results</h2>
            <p>Total number of surveys: ${totalSurveys}</p>
            <p>Average Age: ${averageAge}</p>
            <p>Oldest person who participated in survey: ${oldestPerson}</p>
            <p>Youngest person who participated in survey: ${youngestPerson}</p>
            <p>Percentage of people who like Pizza: ${pizzaPercentage}%</p>
            <p>Percentage of people who like Pasta: ${pastaPercentage}%</p>
            <p>Percentage of people who like Pap and Wors: ${papAndWorsPercentage}%</p>
            <p>Average rating for watching movies: ${averageRating(movieRatings)}</p>
            <p>Average rating for listening to radio: ${averageRating(radioRatings)}</p>
            <p>Average rating for eating out: ${averageRating(eatOutRatings)}</p>
            <p>Average rating for watching TV: ${averageRating(tvRatings)}</p>
        `;
    }

    mainContent.innerHTML = '';
    mainContent.appendChild(surveyResults);
    surveyResults.style.display = 'block';
});
