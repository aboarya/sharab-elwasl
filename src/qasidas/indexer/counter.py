#!/usr/bin/env python
from os import listdir
from os.path import isfile, join
import unicodedata

results = dict()

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])

def process_line(lineText):
    words = lineText.split(' ')
    for word in words:
        word =remove_accents(word.decode('utf-8')).encode('utf-8')
        
        if '*' in word or len(word) < 6 or not bool(word.strip()): continue
        if word not in results:
            results[word] = 1
        else:
            results[word] = results[word] + 1

def write_results(directory):
    with open(directory+"/"+"results.csv", "wb") as _file:
        import operator
        sorted_x = sorted(results.items(), key=operator.itemgetter(1), reverse=True)
        for word, _count in sorted_x:
            _file.write("{},{}\n".format(word,_count))

def main():
    directory = '/Users/sameh/burhaniya/sharab-elwasl/assets'
    qasidas = [f for f in listdir(directory) if isfile(join(directory, f)) and ".txt" in f]
    
    count = 0
    for filename in qasidas:
        count += 1
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
                            process_line(lineText)
            except UnicodeDecodeError as e:
                # print("Decode error at: " + str(lineNum) + ':' + str(txtNum))
                print(e)
        

    write_results(directory)
    print 'done with count of {} files'.format(count)

if __name__ == '__main__':
    main()