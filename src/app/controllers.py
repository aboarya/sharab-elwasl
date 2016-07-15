import os
import base64
import flask

import api
from app import sharabelwasl


# routing for basic pages (pass routing onto the Angular app)
@sharabelwasl.route('/')
def basic_pages(**kwargs):
    return flask.render_template('index.html')

# special file handlers and error handlers
@sharabelwasl.route('/favicon.ico')
def favicon():
    return flask.send_from_directory(os.path.join(sharabelwasl.root_path, 'static'),
                               'img/favicon.ico')


@sharabelwasl.errorhandler(404)
def page_not_found(e):
    return flask.render_template('404.html'), 404

@sharabelwasl.route('/partial/<name>')
def hello(name=None):
    return flask.render_template('{}.html'.format(name))


@sharabelwasl.route('/resources/<name>')
def resources(name=None):
    return flask.make_response(open('app/resources/{}'.format(name)).read())

@sharabelwasl.route('/search/<lang>/<term>')
@api.make_ajax
def search(term=None, lang=None):

    keys = ['_title', '_first', '_second']
    langs = ['ar', lang]
    
    lang_first = '{}_first'.format(lang)
    user_translations  = '{}_user_translations'.format(lang)

    es_results = api.search(term)

    results =[{
        lang : {key : result['{}{}'.format(lang,key)] for key in keys } for lang in langs 
        } for result in es_results
    ]

    dynamo_results = api.dynamo.get(lang, es_results)
    final = [ dict(r, **{user_translations: d}) for d in dynamo_results for r in results if d[lang_first] == r[lang]['_first'] ]
    return flask.jsonify(final)
