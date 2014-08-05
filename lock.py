import os.path

def lock():
  lockfile = open('__dependencylock', 'w')
  lockfile.close()

def isLocked():
  return os.path.isfile('__dependencylock')

def unlock():
  try:
    os.remove('__dependencylock')
  except:
    print('depenedents: lock isn\'t set')
