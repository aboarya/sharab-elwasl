import boto3
client = boto3.client('dynamodb')

# def get(lang, items):
#     key = '{}_first'.format(lang)
#     attrs = ['first_user_translation', 'second_user_translation',
#         'first_num_up_votes', 'second_num_up_votes',
#         'first_num_down_votes', 'second_num_down_votes', key]

#     # raise RuntimeError([{'{}{}'.format(lang, key): {'S': item['{}{}'.format(lang, key)]}  for key in keys} for item in items][0])
#     query = { 
#         'user_verse_{}'.format(lang): {'Keys' : [{key: {'S': item[key]}} for item in items], 'AttributesToGet': attrs},
#         ''

#         }
#     dynamo_results = client.batch_get_item(RequestItems=query)
#     results = dynamo_results['Responses']['user_verse_{}'.format(lang)]
#     for attr in attrs:
#         for result in results:
#             result.update({attr: result[attr].values()[0]})

#     return results

def get(lang, items):
    key = '{}_first'.format(lang)
    attrs = ['first_user_translation', 'second_user_translation',
        'first_num_up_votes', 'second_num_up_votes',
        'first_num_down_votes', 'second_num_down_votes', key]
    
    user_verse_Keys, verse_Keys, qaida_Keys = [],[],[]
    _user_verse_Keys, _verse_Keys, _qaida_Keys = [],[],[]
    for item in items:
        if not item['_source']['qasida_number'] in _qaida_Keys:
            _qaida_Keys.append(item['_source']['qasida_number'])
            qaida_Keys.append({"qasida_number" : { "S" : str(item['_source']['qasida_number'])}})

        if not item['_source']['en_first'] in _verse_Keys:
            _verse_Keys.append(item['_source']['en_first'])
            verse_Keys.append({"en_first" : {"S" : item['_source']['en_first']}, "qasida_number" : { "S" : str(item['_source']['qasida_number'])}})

        if not item['_source']['en_first'] in _user_verse_Keys:
            _user_verse_Keys.append(item['_source']['en_first'])
            user_verse_Keys.append({"en_first" : {"S" : item['_source']['en_first']},})


    # raise RuntimeError(qaida_Keys)

    query = { 
        # 'user_verse_{}'.format(lang) : {'Keys' : user_verse_Keys, "ProjectionExpression" :"qasida_number, en_first, en_second, first_user_translation, second_user_translation"},
        'verse_{}'.format(lang) : {'Keys' : verse_Keys,},
        'qasida' : {'Keys' : qaida_Keys,}

        }
    dynamo_results = client.batch_get_item(RequestItems=query)
    # results = dynamo_results['Responses']['user_verse_{}'.format(lang)]
    # for attr in attrs:
    #     for result in results:
    #         result.update({attr: result[attr].values()[0]})

    return  dynamo_results
