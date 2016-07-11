#! /usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import xml.etree.ElementTree
from indexer import indexer
from query import query

from translate.translate import GoogleTranslator

import unicodedata
encoding = "utf-8"
def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])

if __name__ == '__main__':
    # directory = sys.argv[1]
    # e = xml.etree.ElementTree.parse(directory+'/chapters.xml').getroot()
    # indexer.create_index(directory, e)

    # translator = GoogleTranslator()
    # text = remove_accents(' '.join(sys.argv[1:]).decode(encoding))
    # print text.encode(encoding)
    # print translator.translate(text.encode(encoding))
    query.search(remove_accents(' '.join(sys.argv[1:]).decode(encoding)))