
def search(term):
    from elasticsearch import Elasticsearch
    from app import settings
    _es = Elasticsearch(settings.ES_HOST)

    body = {"query":{"bool":{"must":[{"query_string":{"default_field":"_all","query":"love"}}],"must_not":[],"should":[]}},"from":0,"size":10,"sort":[],"aggs":{}}
    res = _es.search(index="sharab-elwasl", body=body)

    print("%d documents found for term %s" % (res['hits']['total'], term))

    return [res['_source'] for res in sorted(res['hits']['hits'], key=lambda r: r['_score'], reverse=True)]
