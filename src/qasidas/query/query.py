#! /usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import random
import uuid
import base64
import boto3
client = boto3.client('dynamodb')

import elasticsearch
from elasticsearch import Elasticsearch

_es = Elasticsearch()
lang = 'en'

body = {"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":"mustafa"}}],"must_not":[],"should":[]}},"from":0,"size":50,"sort":[],"aggs":{}}
res = _es.search(index="sharab-elwasl", body=body)
print("%d documents found" % res['hits']['total'])
es_results = [res['_source'] for res in sorted(res['hits']['hits'], key=lambda r: r['_score'], reverse=True)]
print len(es_results)
for es_result in es_results:
    import time
    time.sleep(2)
    print 'putting item in dynamo'
    # client.put_item(TableName='qasida',Item={"qasida_number": {"S": str(es_result['qasida_number']) }})

    # client.put_item(TableName='verse_en',Item={"en_first": {"S": es_result['en_first']}, "qasida_number" : {"S":str(es_result['qasida_number']) },})
    # if str(es_result['qasida_number']) == str(1):
    #     es_result['en_first'] = es_result['en_first'].replace('Ibrahim', 'Ebrahim')
    client.put_item(TableName='user_verse_en',Item={
        "first_second" : {"S" : '{}_{}'.format(es_result['en_first'], es_result['en_second'])},
                    "en_first": {
                        "S": es_result['en_first']
                    },
                    "en_second": {
                        "S": es_result['en_second']
                    },
                    "line_number": {
                        "S": str(es_result['line_number'])
                    },
                    "qasida_number" : {"S" : str(es_result['qasida_number'])
                    },
                    "vote_total": {
                        "N": str(random.randint(1,20))
                    },
                    "vote_count": {
                        "N": str(random.randint(1,20))
                    },
                    "vote_average": {
                        "N": str(random.randint(1,20))
                    },
                    "na_title": {
                        "S": base64.b64encode(str(es_result['na_title']))
                    },
        })
    break