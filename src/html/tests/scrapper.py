#!/usr/bin/env python

from bs4 import BeautifulSoup
import urllib

with open('template.html') as f:
    soup = BeautifulSoup(f, 'html.parser')
    elems = soup.findAll(src=True)
    # elems = soup.findAll(href=True)
    for elem in elems:
        href = elem['src']
        if href == "" or href == "#" or not 'http' in href: continue
        name = href[href.rindex('/')+1:]
        if name == "" or name == "#": continue
        print 'downloading', href
        urllib.urlretrieve (href, "assets/{}".format(name))
    # srcs = soup.findAll(src=True)