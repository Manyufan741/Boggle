from boggle import Boggle
from flask import Flask, request, render_template, jsonify, session
#from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = "oneonetwotwo"
#debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def home():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('home.html', board=board)


@app.route('/check-word')
def word_checking():
    guess = request.args["guess"]
    result = boggle_game.check_valid_word(session['board'], guess)
    return jsonify({'result': result})


@app.route('/game-end-update', methods=["POST"])
def game_update():
    old_high_score = session.get('high_score', 0)
    high_score = request.json["highScore"]
    #session['high_score'] = high_score if high_score > session['high_score'] else session['high_score']
    if high_score > old_high_score:
        session['high_score'] = high_score
    session['played_times'] = session.get('played_times', 0) + 1
    return jsonify({'highScore': session['high_score'], 'playedTimes': session['played_times']})
