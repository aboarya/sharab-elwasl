import uuid

import boto3
from boto3.dynamodb.conditions import Key, Attr
client = boto3.client('dynamodb')

def scan(lang, qasida_number, line_number):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_verse_{}'.format(lang))

    attrs = ['first_user_translation', 'second_user_translation',
    'num_down_votes', 'num_up_votes', 'qasida_number', 'line_number', 'translation_id']

    response = table.scan(
        FilterExpression=Key('qasida_number').eq(qasida_number) & Key('line_number').eq(line_number),
        ProjectionExpression=",".join(attrs)
        )

    return response

def update(lang, uuid, vote, is_up_vote=True):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_verse_{}'.format(lang))

    key = {'translation_id' : uuid,}

    if is_up_vote: ue = "set num_up_votes = :r"
    else: ue = "set num_down_votes = :r"

    response = table.update_item(Key=key,
        UpdateExpression=ue,
        ExpressionAttributeValues={
            ':r': vote,
        },
        ReturnValues="ALL_NEW"
    )

    return response

def add(lang, qasida_number, line_number, user_first, user_second):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('user_verse_{}'.format(lang))

    item = {
        'translation_id' : str(uuid.uuid4()),
        'qasida_number' : qasida_number,
        'line_number' : line_number,
        'first_user_translation' : user_first,
        'second_user_translation' : user_second,
        'num_up_votes' : int(1),
        'num_down_votes' : int(0)
    }

    response = table.put_item(Item=item, ReturnValues="ALL_OLD")
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return item
    return response
