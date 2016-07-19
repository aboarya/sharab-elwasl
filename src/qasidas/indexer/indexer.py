#! /usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import elasticsearch
import unicodedata
import datetime
import time
import math

from os import listdir
from os.path import isfile, join
import xml.etree.ElementTree

from translate.translate import GoogleTranslator
translator = GoogleTranslator()
encoding = "utf-8"
targets = ("en", "de", "nl", "fr")

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])

def get_attrs(filename, e):
    
    elem = e.find('.//chapter[@content="{}"]'.format(filename))
    return elem.attrib['title'], int(elem.attrib['id']) - 1

def index(index_name, es, title, txtNum, lineNum, body):
    es.index(index=index_name, doc_type='verse', id=txtNum, body=body)

def _translate(target, lineText):
    try:
        return translator.translate(lineText, source="ar", target=target)[0]['translatedText']
    except KeyError as e:
        raise e
        return ""

def _make_index(data):
    added = time.mktime(datetime.datetime.now().timetuple()) * 1000
    return {
        'qasida_number' : data['qasida_number'],
        'title' : data['title'],
        'ar_title' : data['title'],
        'na_title' : data['title_na'],
        'en_title' : data['title_en'],
        'de_title' : data['title_de'],
        'nl_title' : data['title_nl'],
        'fr_title' : data['title_fr'],

        'line_number': data['txtNum'],
        'source': data['verse_clean'],
        
        'ar': data['lineText'],
        'ar_first' : data['verse_first'],
        'ar_second' : data['verse_second'],
        'ar_first_na' : data['verse_first_na'],
        'ar_second_na' : data['verse_second_na'],
        
        'en_first' : data['en_first'],
        'de_first' : data['de_first'],
        'fr_first': data['fr_first'],
        'nl_first': data['nl_first'],
        'en_second' : data['en_second'],
        'de_second' : data['de_second'],
        'fr_second': data['fr_second'],
        'nl_second': data['nl_second'],
        'timestamp' : datetime.datetime.now()
    }

def _process_verse(data, counter):
    first, second = data['lineText'].split('***')
    first, second = first.strip(), second.strip()

    data['verse'] = data['lineText']
    data['verse_clean'] = remove_accents(data['lineText'].decode(encoding)).encode(encoding)
    data['verse_first'] = first
    data['verse_second'] = second
    data['verse_first_na'] = remove_accents(first.decode(encoding)).encode(encoding)
    data['verse_second_na'] = remove_accents(second.decode(encoding)).encode(encoding)
                            
    for target in targets:
        time.sleep(0.3)
        data['%s_first'%target] = _translate(target, first)
        data['%s_second'%target] = _translate(target, second)
        if not isinstance(data['title_na'], int):
            data['title_%s' % target] = _translate(target, data['title_na'])
        else:
            data['title_%s' % target] = data['title_na']

    time.sleep(2*math.log(counter))
    print "indexing qasida line", counter
    index("sharab-elwasl", data['es'], data['title'],
        data['txtNum'], data['lineNum'], _make_index(data))

def _process_title(_title, number):
    a, title = _title.split(':')
    c = title[title.rindex('('):]
    title = title.replace(c,'')

    if len(title) > 2:
        return title

    return str(number)
    
def create_index(directory, e):
    es = elasticsearch.Elasticsearch()  
    qasidas = [f for f in listdir(directory) if isfile(join(directory, f)) and ".txt" in f]

    for filename in qasidas:
        title, number = get_attrs(filename, e)

        title_na = remove_accents(title).encode(encoding)
        
        title_na = _process_title(title_na, number)

        # if number == 43: continue
        print "indexing qasida", title_na

        with open(directory+"/"+filename) as qasida:
            lineNum = 0 # line number including empty lines
            txtNum = 0 # line number of non-empty lines
            try:                
                for lineText in qasida:
                    lineNum += 1
                    if '----------' in lineText: continue
                    if '***' in lineText:
                        if len(lineText) > 0:
                            txtNum += 1
                            # load line
                            if "-" in lineText: lineText = lineText[lineText.index('-')+1:]

                            data = dict(qasida_number=number, es=es, lineNum=lineNum)
                            data.update(dict(title=title, title_na=title_na, txtNum=txtNum, lineText=lineText))
                            _process_verse(data, txtNum)

            except UnicodeDecodeError as e:
                # print("Decode error at: " + str(lineNum) + ':' + str(txtNum))
                print(e)

# if __name__ == '__main__':
#     directory = sys.argv[1]
#     e = xml.etree.ElementTree.parse(directory+'/chapters.xml').getroot()
#     create_index(directory, e)
#     print translator.translate("Einen schönen Tag allerseits")