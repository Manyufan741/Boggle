class BoggleGame {
    constructor(sec = 60) {
        this.sec = sec;
        this.score = 0;
        this.highScore = 0;
        this.word = new Set();
        this.clockId = 0;
        $('#guess-form').on("submit", this.handleSubmit.bind(this));
        this.startClock();
    }

    async handleSubmit(evt) {
        evt.preventDefault();
        const guess = $('#guess-id').val();
        $('#guess-id').val("");
        //handle empty input case
        if (!guess) {
            alert("Please enter something!!")
            return
        }
        const response = await axios.get('/check-word', { params: { guess: guess } });
        //console.log(response);
        if (response.data.result == "ok") {
            $('#guess-result-message').empty();
            //Handle guessed word situations
            if (this.word.has(guess)) {
                $('#guess-result-message').append($('<p>You have gotten this one already!</p>'));
            } else {
                this.score += 1;
                if (this.score >= this.highScore) {
                    this.highScore = this.score;
                    console.log("high score", this.highScore);
                    // $('#high-score').text(`${this.highScore}`);
                }
                this.word.add(guess);
                $('#guess-result-message').append($('<p>Okay! You got one!</p>'));
            }
            $('#score-text').text(`Current score: ${this.score}`)
        }
        else if (response.data.result == "not-on-board") {
            $('#guess-result-message').empty();
            $('#guess-result-message').append($('<p>Nice guess but this word is not on this board.</p>'));
        }
        else {
            $('#guess-result-message').empty();
            $('#guess-result-message').append($('<p>This is jibberish.</p>'));
        }
    }

    startClock() {
        //Start the countdown
        //console.log('clockID', this.clockId);
        this.clockId = setInterval(this.countDown.bind(this), 1000); //need bind to keep the "this" scope of countDown the same as this class. Not using bind would cuase this.sec in countdown to be undefined.
    }

    async countDown() {
        //the this in this function would be of the same scope as the caller, which would be different to "this" of the scope of this class. So we use bind in the startClock function to keep "this" in the same class scope
        //console.log("this.sec", this.sec);
        if (this.sec > 0) {
            $('#timer').empty();
            $('#timer').append($(`<p>You have ${this.sec} seconds left!</p>`));
            this.sec -= 1;
        } else {
            //Stop the clock
            //console.log("stop!");
            $('#timer').empty();
            $('#timer').append($(`<p>Okay time's up!</p>`));
            clearInterval(this.clockId);
            $('#guess-form').hide();
            await this.gameEnd();
        }
    }

    async gameEnd() {
        const response = await axios.post('/game-end-update', { highScore: this.highScore });
        $('#info-section').hide();
        $('#all-time-high').append($(`<p>All time high score is: ${response.data.highScore}</p>`));
        $('#played-times').append($(`<p>You've played this game ${response.data.playedTimes} times.</p>`));
        //server return: jsonify({'highScore': session['high_score'], 'playedTimes': session['played_times']})
    }
}
