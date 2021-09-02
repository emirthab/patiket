from flask import Flask
from src.api.listeners import listener
from src.api.oauth import listener as oauth

app = Flask(__name__)

app.config['JSON_AS_ASCII'] = False
app.register_blueprint(listener)
app.register_blueprint(oauth)


if __name__ == "__main__":
	app.run(port=5000,debug=False)