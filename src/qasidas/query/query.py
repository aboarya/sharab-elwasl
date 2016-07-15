#! /usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import random

import boto3
client = boto3.client('dynamodb')

import elasticsearch
from elasticsearch import Elasticsearch

_es = Elasticsearch()
lang = 'en'

body = {"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":"love"}}],"must_not":[],"should":[]}},"from":0,"size":50,"sort":[],"aggs":{}}
res = _es.search(index="sharab-elwasl", body=body)
print("%d documents found" % res['hits']['total'])
es_results = [res['_source'] for res in sorted(res['hits']['hits'], key=lambda r: r['_score'], reverse=True)]
print len(es_results)
for es_result in es_results:
    print 'putting item in dynamo'
    client.put_item(TableName='user_verse_en',Item={
                    "en_first": {
                        "S": es_result['en_first']
                    },
                    "first_user_tranlsation": {
                        "S": es_result['en_first']
                    },
                    "first_num_up_votes": {
                        "N": str(random.randint(1,20))
                    },
                    "first_num_down_votes": {
                        "N": str(random.randint(1,20))
                    },
                    "en_second": {
                        "S": es_result['en_second']
                    },
                    "second_user_tranlsation": {
                        "S": es_result['en_second']
                    },
                    "second_num_up_votes": {
                        "N": str(random.randint(1,20))
                    },
                    "second_num_down_votes": {
                        "N": str(random.randint(1,20))
                    }
        })

# key = '{}_first'.format(lang)
# attrs = ['first_user_tranlsation', 'second_user_tranlsation',
#         'first_num_up_votes', 'second_num_up_votes',
#         'first_num_down_votes', 'second_num_down_votes', key]

# query = { 'user_verse_{}'.format(lang): {
#                 'Keys' : [{key: {'S': item[key]}} for item in items],
#                 'AttributesToGet': attrs
#             }
#         }
# raise RuntimeError([{key: {'S': item[key]}} for item in items])
# results = client.batch_get_item(RequestItems=query)
# results = results['Responses']['user_verse_{}'.format(lang)]