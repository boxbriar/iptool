import json
import urllib.request
from os import environ
from flask import Flask, Response, render_template, request

app = Flask(__name__)

LOCAL = ["127.0.0.1","localhost"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lookup/')
def lookup():
    # Get target from querystring.
    target = request.args.get("target")
    if not target:
        # Use request ip if target arg not set.
        target = request.remote_addr
        if target in LOCAL:
            target = "google.com"
    
    # Make request to ip-api.com json api.
    try:
        requestURL = "http://ip-api.com/json/{}".format(target)
        rsp = urllib.request.urlopen(requestURL)
        data = rsp.read().decode(rsp.info().get_param('charset') or 'utf-8')
        return Response(data, mimetype='application/json')
    except Exception as err:
        # Return error in json response.
        return Response(json.dumps({"message": str(err), "status": "fail"}), mimetype='application/json')


if __name__ == '__main__':
    DEBUG = True
    HOST = "0.0.0.0"
    PORT = 5555

    app.run(HOST, PORT, debug=DEBUG)