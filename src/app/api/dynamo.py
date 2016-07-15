import boto3
client = boto3.client('dynamodb')

def get(lang, items):
    key = '{}_first'.format(lang)
    attrs = ['first_user_tranlsation', 'second_user_tranlsation',
        'first_num_up_votes', 'second_num_up_votes',
        'first_num_down_votes', 'second_num_down_votes', key]

    # raise RuntimeError([{'{}{}'.format(lang, key): {'S': item['{}{}'.format(lang, key)]}  for key in keys} for item in items][0])
    query = { 'user_verse_{}'.format(lang): {
                'Keys' : [{key: {'S': item[key]}} for item in items],
                'AttributesToGet': attrs
            }
        }
    dynamo_results = client.batch_get_item(RequestItems=query)
    results = dynamo_results['Responses']['user_verse_{}'.format(lang)]
    for attr in attrs:
        for result in results:
            result.update({attr: result[attr].values()[0]})

    return results