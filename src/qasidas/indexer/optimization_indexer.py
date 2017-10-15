#! /usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import unicodedata
import datetime
import time
import math
import json

from os import listdir
from os.path import isfile, join
import xml.etree.ElementTree

encoding = "utf-8"

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])


def get_attrs(filename, e):
    
    elem = e.find('.//chapter[@content="{}"]'.format(filename))
    return elem.attrib['title'], int(elem.attrib['id']) - 1


def _process_verse(data, counter):
    first, second = data['lineText'].split('***')
    first, second = first.strip(), second.strip()

    data['verse'] = data['lineText']
    data['verse_clean'] = remove_accents(data['lineText'].decode(encoding)).encode(encoding)
    data['verse_first'] = first
    data['verse_second'] = second
    data['verse_first_na'] = remove_accents(first.decode(encoding)).encode(encoding)
    data['verse_second_na'] = remove_accents(second.decode(encoding)).encode(encoding)


def _process_title(_title, number):
    try:
        a, title = _title.split(':')
        c = title[title.rindex('('):]
        title = title.replace(c,'')

        if len(title) > 2:
            return title
    except:
        pass
    return str(number)


def get_num_verses(lineText):
    try:
        return lineText.split(':')[1].strip()
    except:
        return ""


def get_dates(lineText):
    try:
        dates = lineText.split(':')[1].split('=')
    except:
        dates = lineText.split('=')
    finally:
        return (d.strip() for d in dates)


def merge_verses(verses):
    """
    public static final String verse = "verse";
    public static final String verse_clean = "verse_clean";
    public static final String verse_first = "verse_first";
    public static final String verse_second = "verse_second";
    public static final String verse_first_na = "verse_first_na";
    public static final String arabic_date = "arabic_date";
    public static final String title = "title";
    public static  final String qasida_number = "qasida_number";
    public static final String num_verses = "num_verses";
    """

    qasida_number = verses[0]["qasida_number"]
    num_verses = verses[0]["num_verses"]
    arabic_date = verses[0]["arabic_date"]
    title = verses[0]["title"]

    qasida = '\n\n'.join(verse['verse'] for verse in verses)
    qasida_clean = '\n'.join(verse['verse_clean'] for verse in verses)

    return dict(
        qasida_number = qasida_number,
        num_verses = num_verses,
        arabic_date = arabic_date,
        qasida = qasida,
        qasida_clean = qasida_clean,
        title = title

    )

    
def create_index(directory, e):
    
    qasidas = [f for f in listdir(directory) if isfile(join(directory, f)) and ".txt" in f]
    
    count = 0


    Qasidas = []

    for filename in qasidas:
        title, number = get_attrs(filename, e)

        # title_na = remove_accents(title).encode(encoding)
        
        title_na = _process_title(title, number)

        start = datetime.datetime.now()
        
        print "indexing qasida", title_na, filename

        with open(directory+"/"+filename) as qasida:
            verses = []
            count += 1
            lineNum = 0 # line number including empty lines
            txtNum = 0 # line number of non-empty lines
            try:                
                for lineText in qasida:
                    lineNum += 1

                    if 'الأبيات' in lineText:
                        num_verses = get_num_verses(lineText)

                    if '=' in lineText:
                        arabic_date, gregorian_date = get_dates(lineText)

                    if '----------' in lineText: continue
                    
                    if '***' in lineText:
                        lineText = lineText.replace('\r\n', '')
                        if len(lineText) > 0:
                            txtNum += 1
                            # load line
                            if "-" in lineText: lineText = lineText[lineText.index('-')+1:]

                            data = dict(qasida_number=number,
                                lineNum=lineNum,
                                num_verses=num_verses,
                                arabic_date=arabic_date,
                                gregorian_date=gregorian_date,
                                title=title,
                                title_na=title_na,
                                txtNum=txtNum,
                                lineText=lineText)

                            _process_verse(data, txtNum)

                            verses.append(data)

                Qasidas.append(merge_verses(verses))
                # break
            except UnicodeDecodeError as e:
                # print("Decode error at: " + str(lineNum) + ':' + str(txtNum))
                print(e)

    with open('./qasidas.json', 'w') as outfile:
        json.dump(Qasidas, outfile)

    end = datetime.datetime.now()
    duration = end - start
    d = divmod(duration.total_seconds(), 86400)
    h = divmod(d[1],3600)  # hours
    m = divmod(h[1],60)  # minutes
    s = m[1]  # seconds
    print 'indexing %d qasidas took %d days, %d hours, %d minutes, %d seconds' % (count,d[0],h[0],m[0],s)

if __name__ == '__main__':
    directory = sys.argv[1]
    e = xml.etree.ElementTree.parse(directory+'/chapters.xml').getroot()
    create_index(directory, e)
