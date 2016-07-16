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

    es_results, ordered = api.search(term)

    # if es_results:
    #     dynamo_results = api.dynamo.get(lang, es_results)
    #     if dynamo_results:
    #         for result in results:
    #             for dynamo_result in dynamo_results:
    #                 if result[lang]['_first'] == dynamo_result[lang_first]:
    #                     result[user_translations] = dynamo_result

    #             if not user_translations in result:
    #                 result[user_translations] = dict()
    # else:
    #     final = results
    print '>>>>>>>>>>>>> returning %d qasidas' % len(ordered)
    response = dict(next='search',data=ordered)
    return flask.jsonify(response)
