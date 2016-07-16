from collections import defaultdict


def group(es_results):
    keys = ['ar_title', 'de_first','de_second', 'de_title', 'en_first',
        'en_second', 'en_title', 'fr_first', 'fr_second',
        'fr_title', 'lineNum', 'nl_first', 'nl_second',
        'nl_title', 'qasida_number','ar_first','ar_second', 'lineNum']

    results = defaultdict(list)
    for result in es_results:
        results[result['_source']['qasida_number']].append({key: result['_source'][key] for key in keys})
        
    return [{key: value} for key, value in results.items()]

def search(term):
    from elasticsearch import Elasticsearch
    from app import settings
    _es = Elasticsearch(settings.ES_HOST)

    body = {
    "query":
        {"bool":
            {"must":[{
                "query_string": {
                    "default_field":"_all",
                    "query":term
                    }
                    }]
                }
            },
        "from":0,
        "size":10,
        }

    res = _es.search(index="sharab-elwasl", body=body)

    print("%d documents found for term %s" % (res['hits']['total'], term))

    if bool(res['hits']['total']):
        # x  = group(res['hits']['hits'])
        return (res['hits']['hits'], group(res['hits']['hits']))
    return ([],[])
