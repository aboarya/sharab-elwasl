#! /usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import elasticsearch


# check command line
# numArgs = len(sys.argv)
# if numArgs < 3:
#     print(str(len(sys.argv)) + ' args provided')
#     usage()
# author = sys.argv[1]
# query = sys.argv[2]
# if numArgs == 4:
#     numResults = sys.argv[3]
# else:
#     numResults = 10
    


# single word query:
#results = es.search(index=author, q=query, size=numResults)
# phrase match query:

# print(json.dumps(results, sort_keys=False, indent=2, separators=(',', ': ')))
"""
{"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":""}}],"must_not":[],"should":[]}},"from":0,"size":10,"sort":[],"aggs":{}}
"""

author="sharab-elwasl"
numResults = 10
encoding = "utf-8"
def search(term):
    print term
    es = elasticsearch.Elasticsearch()  # use default of localhost, port 9200
    results = es.search(
    index=author,
    body={
        "size": numResults,
        "query": {"match": 
                {
                # "text": {"query": term, "type": "phrase"},
                "arabic_na": {"query": term, "type": "phrase"},

        }}})
    # results = es.search(index=author, q=term, size=numResults)
    hitCount = results['hits']['total']
    if hitCount > 0:
    # the next might be needed if text is UTF-8 and there are mapping errors
    #utf8stdout = open(1, 'w', encoding='utf-8', closefd=False)
        if hitCount is 1:
            print(str(hitCount) + ' result')
        else:
            print(str(hitCount) + ' results')
        previousLine = ""
        for hit in results['hits']['hits']:
            text = hit['_source']['arabic']
            print text
            # lineNum = hit['_source']['lineNum']
            # score = hit['_score']
            # title = hit['_type']
            # if lineNum > 1:
            #     previousLine = es.get(index=author, doc_type=title, id=lineNum-1)
            # nextLine = es.get(index=author, doc_type=title, id=lineNum+1)
            # #print(str(lineNum) + ' (' + str(score) + '): ' + text, file=utf8stdout)
            # print(title + ': ' + str(lineNum) + ' (' + str(score) + '): ')
            # print(previousLine['_source']['text'] + text + nextLine['_source']['text'])
    else:
        print('No results')


# query(sys.argv[1].decode(encoding))