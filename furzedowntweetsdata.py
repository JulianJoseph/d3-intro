from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
import datetime

app = Flask(__name__)

MONGODB_HOST = ''
MONGODB_PORT = 0
DBS_NAME = 'furzedowntweets'
COLLECTION_NAME = 'followers'
FIELDS = {'date' : True, 'count' : True, '_id' : False}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/rawdata")
def rawdata():
    conn = MongoClient('mongodb://your connection string')
    collection = conn[DBS_NAME][COLLECTION_NAME]
    data = collection.find(projection=FIELDS)
    json_data = []
    for row in data:
        json_data.append(row)
    json_data = json.dumps(json_data, default=customConverter)
    conn.close()
    return json_data

#https://code-maven.com/serialize-datetime-object-as-json-in-python
def customConverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()

if __name__ == "__main__":
    app.run(debug=True)
