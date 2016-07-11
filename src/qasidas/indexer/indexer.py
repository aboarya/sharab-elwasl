#! /usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import elasticsearch
import unicodedata

from os import listdir
from os.path import isfile, join
import xml.etree.ElementTree

# from translate.translate import GoogleTranslator
# translator = GoogleTranslator()
encoding = "utf-8"

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])

def get_attrs(filename, e):
    
    elem = e.find('.//chapter[@content="{}"]'.format(filename))
    return elem.attrib['title'].replace(')','').replace('(',''), int(elem.attrib['id']) - 1

def index(index_name, es, title, txtNum, lineNum, lineText, cleaned):
    es.index(index=index_name, doc_type=title, id=txtNum, body = {
        'lineNum': lineNum,
        'arabic': lineText,
        'arabic_na': cleaned,
    })

def create_index(directory, e):
    es = elasticsearch.Elasticsearch()  
    qasidas = [f for f in listdir(directory) if isfile(join(directory, f)) and ".txt" in f]

    for filename in qasidas:
        title, number = get_attrs(filename, e)
        print "indexing qasida", title
        with open(directory+"/"+filename) as qasida:
            lineNum = 0 # line number including empty lines
            txtNum = 0 # line number of non-empty lines
            try:
                for lineText in qasida:
                    lineNum += 1
                    if len(lineText) > 0:
                        txtNum += 1
                        # load line
                        if "-" in lineText: lineText = lineText[lineText.index('-')+1:]
                        cleaned = remove_accents(lineText.decode(encoding))
                        # english = translator.translate(lineText, source="ar", target="en")
                        # german  = translator.translate(lineText, source="ar", target="de")
                        # french  = translator.translate(lineText, source="ar", target="fr")
                        index("sharab-elwasl", es, title, txtNum, lineNum, lineText, cleaned.encode(encoding))

                        # index("sharab-elwasl_ar", es, title, txtNum, lineNum, cleaned)
            except UnicodeDecodeError as e:
                # print("Decode error at: " + str(lineNum) + ':' + str(txtNum))
                print(e)

# if __name__ == '__main__':
#     directory = sys.argv[1]
#     e = xml.etree.ElementTree.parse(directory+'/chapters.xml').getroot()
#     create_index(directory, e)
#     print translator.translate("Einen schönen Tag allerseits")
