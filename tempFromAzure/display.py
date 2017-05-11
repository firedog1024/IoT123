import sys
import time
from microdotphat import write_string, scroll, clear, show


#print 'starting the display'
#sys.stdout.flush()

while True :
  for text in iter(sys.stdin.readline, '') :
    #print text
    #sys.stdout.flush()
    clear()
    if (text.startswith('|t|')) :
      text = text[3:-1] 
      write_string(text + u'\u00b0' + 'F', kerning=False)
    elif (text.startswith('|h|')) :
      text = text[3:-1]
      write_string(text + '%', kerning=False)
    else :
      text = text[:-1]
      if (len(text) > 6) :
        write_string(text + '                ', kerning=True)
      else :
        write_string(text, kerning=False)

    if (len(text) > 6) :
      for num in range(0, len(text)*6-3) :
        scroll()
        show()
        time.sleep(0.05) 
    else :  
      show()
