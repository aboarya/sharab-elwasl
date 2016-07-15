import os
import json
from flask import Flask, request, Response
from flask import render_template, send_from_directory, url_for

sharabelwasl = Flask(__name__)

sharabelwasl.config.from_object('app.settings')

sharabelwasl.url_map.strict_slashes = False

import app.controllers
