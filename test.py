from unittest import TestCase
from app import app
from flask import session, request
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_board_generation(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>Let's play BOGGLE!</h1>", html)

    def test_board_session(self):
        with app.test_client() as client:
            # with client.session_transaction() as change_session:
            #    change_session['board'] = board
            res = client.get('/')
            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)

    def test_word_check(self):
        """to test the word_checking function when getting the "/check-word" request"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['board'] = [["T", "H", "I", "S", "I"],
                                 ["H", "T", "H", "I", "S"],
                                 ["I", "H", "T", "S", "T"],
                                 ["S", "I", "S", "T", "H"],
                                 ["J", "K", "I", "M", "G"]]
            res = client.get('/check-word?guess=this')
            self.assertEqual(res.json['result'], 'ok')

    def test_game_end_update(self):
        """to test the game_update function after the game ends with post request"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['high_score'] = 9
                sess['played_times'] = 0
            # If you don't specify json as an argument, it gets put into the request.data attribute rather than request.json.
            res = client.post('/game-end-update', json={'highScore': 10})
            #self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json['highScore'], 10)
