#! /usr/bin/env python
# -*- coding: utf-8 -*-
from collections import defaultdict
import logging

from app import sharabelwasl

def create_query_body(terms):
    _template = { "query" : 
        {"bool": {"should": []}}, "from":0, "size":10,}

    # _should = [{"match" : {"{}_first".format(lang) : term}}, {"match" :  {"{}_second".format(lang) : term}} ]
    _should = [{"match" : {"{}_{}".format(lang, key) : term}} for key in ('first', 'second') for lang, term in terms.items() if lang != 'ar']
    if 'ar' in terms:
        _should.append([{"match" : {"{}_{}_na".format('ar', key) : term }} for key in ('first', 'second') for lang, term in terms.items() if lang == 'ar'])

    _template['query']['bool']['should'] = _should

    sharabelwasl.logger.debug(u"sending %s to ES " % _should)
    return _template

def group(es_results):
    keys = ['ar_title', 'de_first','de_second', 'de_title', 'en_first',
        'en_second', 'en_title', 'fr_first', 'fr_second',
        'fr_title', 'nl_first', 'nl_second',
        'nl_title', 'qasida_number','ar_first','ar_second', 'line_number', 'na_title']

    
    results = defaultdict(list)
    count = 0
    for result in es_results:
        d = {key: result['_source'][key] for key in keys}
        d.update({"_score" : result['_score']})
        results[result['_source']['qasida_number']].append(d)
    
    return sorted(results.items(), key=lambda (k,v): v[0]['_score'], reverse=True)

def read(number, start=0, end=10):
    from elasticsearch import Elasticsearch
    from app import settings
    _es = Elasticsearch(settings.ES_HOST)

    _template = { "query" : 
        {"bool": {"must": {"type" : {"value" : number}}}}, "from":0, "size":900,}

    try:
        res = _es.search(index="sharab-elwasl", body=_template)
        
    except Exception, e:
        raise e
        sharabelwasl.logger.exception("exception while searching ES")

    if bool(res['hits']['total']):
        return [res['_source'] for res in sorted(res['hits']['hits'], key=lambda k: k['_source']['line_number'])]

    return []



def search(terms):
    from elasticsearch import Elasticsearch
    from app import settings
    _es = Elasticsearch(settings.ES_HOST)

    try:
        res = _es.search(index="sharab-elwasl", body=create_query_body(terms))
        sharabelwasl.logger.debug(["{}  {}".format(item['_score'], item['_type']) for item in res['hits']['hits']])
    except:
        sharabelwasl.logger.exception("exception while searching ES")
    # print("%d documents found for term %s" % (res['hits']['total'], term))

    if bool(res['hits']['total']):
        # x  = group(res['hits']['hits'])
        return (res['hits']['hits'], group(res['hits']['hits']))
    return ([],[])
