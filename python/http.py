import urllib2

class Http(object):
  def __init__(self):
    self.running = False;

  def start(self):
    print "STARTING HTTP"
    self.running = True;

  def stop(self):
    self.running = False;

  def ping(self, url):
    response = urllib2.urlopen(url).read()
    print response
