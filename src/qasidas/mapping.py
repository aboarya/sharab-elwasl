
import operator


mapping = {
	

	'a' : [u'\u0627',],
	'b' : [u'\u0628',],
	't' : [u'\u062A',],
	'th' : [u'\u062B',],
	'j' : [u'\u062C',],
	'h' : [u'\u062D',u'\u0647'],
	'kh' : [u'\u062E',],
	'd' : [u'\u062F',],

	'r' : [u'\u0631',],
	'z' : [u'\u0632',u'\u0630'],
	's' : [u'\u0633',],
	'sh' : [u'\u0634',],
	'aa' : [u'\u0639',],
	'gh' : [u'\u063A',],
	
	'f' : [u'\u0641',],
	'q' : [u'\u0642',],
	'k' : [u'\u0643',],
	'l' : [u'\u0644',],
	'm' : [u'\u0645',],
	'n' : [u'\u0646',],
	'w' : [u'\u0648',],
	'y' : [u'\u064A',u'\u0649'],
}

sorted_x = sorted(mapping.items(), key=operator.itemgetter(1))

keys = []
values = []
for k,v in sorted_x:
	if len(k) == 2 :
		keys.append(k)
		values.append(v[0])

values.reverse()
print ''.join(keys)
print ''.join(values)

#
#


th kh sh aa gh
