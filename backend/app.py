from flask import Flask
from flask_cors import CORS

from backend.api.board import board_blueprint
from backend.api.task import task_blueprint
from backend.api.user import user_blueprint

app = Flask(__name__)
app.register_blueprint(user_blueprint)
app.register_blueprint(board_blueprint)
app.register_blueprint(task_blueprint)

cors = CORS(app)

if __name__ == '__main__':
    app.run()
