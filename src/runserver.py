#!/usr/bin/env python
import os
from app import sharabelwasl


def runserver():
    port = int(os.environ.get('PORT', 5000))
    sharabelwasl.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    # runserver()
    port = int(os.environ.get('PORT', 5000))
    sharabelwasl.run(host='0.0.0.0', port=port)
