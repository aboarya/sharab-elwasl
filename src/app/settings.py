
DEBUG = True
SECRET_KEY = 'temporary_secret_key'  # make sure to change this

ES_HOST = 'http://10.0.0.205:9200' if DEBUG else ''

LANGUAGES = {
	'en' : 'English',
	'de' : 'Deutsch',
	'fr' : 'French',
	'nl' : 'Dutch'
}