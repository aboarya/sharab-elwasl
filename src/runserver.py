#!/usr/bin/env python
import os

import logging
from logging.handlers import RotatingFileHandler

from app import sharabelwasl


# handler = RotatingFileHandler('sharabelwasl.log', maxBytes=10000, backupCount=1)


def runserver():
    port = int(os.environ.get('PORT', 5000))
    sharabelwasl.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    handler = RotatingFileHandler('sharabelwasl.log', maxBytes=10000000, backupCount=5, encoding='utf-8')
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    sharabelwasl.logger.addHandler(handler)

    port = int(os.environ.get('PORT', 5000))
    sharabelwasl.run(host='0.0.0.0', port=port)
