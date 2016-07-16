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

body = {"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":"ibrahim"}}],"must_not":[],"should":[]}},"from":0,"size":50,"sort":[],"aggs":{}}
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

    client.put_item(TableName='user_verse_en',Item={
                    "first_second_en" : {
                        "S" : '{}_{}'.format(es_result['en_first'], es_result['en_second'])
                    },
                    "en_first": {
                        "S": es_result['en_first']
                    },
                    "first_user_translation": {
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
                    "second_user_translation": {
                        "S": es_result['en_second']
                    },
                    "second_num_up_votes": {
                        "N": str(random.randint(1,20))
                    },
                    "second_num_down_votes": {
                        "N": str(random.randint(1,20))
                    },
                    "qasida_number" : {"S" : str(es_result['qasida_number'])}
        })
    # client.put_item(TableName='user_verse_en',Item={
    #                 "first_second_en" : {
    #                     "S" : '{}_{}'.format(es_result['en_first'], es_result['en_second'])
    #                 },
    #                 "en_first": {
    #                     "S": es_result['en_first']
    #                 },
    #                 "first_user_translation": {
    #                     "S": es_result['en_first']
    #                 },
    #                 "first_num_up_votes": {
    #                     "N": str(random.randint(1,20))
    #                 },
    #                 "first_num_down_votes": {
    #                     "N": str(random.randint(1,20))
    #                 },
    #                 "en_second": {
    #                     "S": es_result['en_second']
    #                 },
    #                 "second_user_translation": {
    #                     "S": es_result['en_second']
    #                 },
    #                 "second_num_up_votes": {
    #                     "N": str(random.randint(1,20))
    #                 },
    #                 "second_num_down_votes": {
    #                     "N": str(random.randint(1,20))
    #                 },"qasida_number" : {"S" : str(es_result['qasida_number'])}
    #     })

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


# def get(lang, items):
#     key = '{}_first'.format(lang)
#     attrs = ['first_user_translation', 'second_user_translation',
#         'first_num_up_votes', 'second_num_up_votes',
#         'first_num_down_votes', 'second_num_down_votes', key]
    
#     user_verse_Keys, verse_Keys, qaida_Keys = [],[],[]
#     for item in items:
#         if not item['qasida_number'] in qaida_Keys:
#             qaida_Keys.append({"qasida_number" : { "S" : item['qasida_number']}})
#         if not item['en_first'] in verse_Keys:
#             verse_Keys.append({"en_first" : {"S" : item['en_first']}})
#         if not item['en_first'] in user_verse_Keys:
#             user_verse_Keys.append({"en_first" : {"S" : item['en_first']}})


#     query = { 
#         'user_verse_{}'.format(lang) : {'Keys' : user_verse_Keys},
#         'verse_{}'.format(lang) : {'Keys' : verse_Keys},
#         'qasida' : {'Keys' : qaida_Keys}

#         }
#     dynamo_results = client.batch_get_item(RequestItems=query)
#     results = dynamo_results['Responses']['user_verse_{}'.format(lang)]
#     for attr in attrs:
#         for result in results:
#             result.update({attr: result[attr].values()[0]})

#     return results

