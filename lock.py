import os.path
from datetime import datetime

# Filename of the lockfile
LOCKFILE = '__dependencylock'

# number of ms until a lockfile is considered stale
STALE_TRESH = 5000

def lock():
  with open(LOCKFILE, 'w') as lockfile:
    time = str(unix_time_millis(datetime.now()))
    lockfile.write(time)

def isLocked():
  return os.path.isfile(LOCKFILE)

def unlock():
  try:
    os.remove(LOCKFILE)
  except:
    print('dependents: lock isn\'t set')

def clearStaleLock():
  if not isLocked():
    return

  with open(LOCKFILE) as lockfile:
    ms = lockfile.read()

  try:
    ms = float(ms)
  except:
    ms = 0

  current_ms = unix_time_millis(datetime.now())

  if current_ms - ms >= STALE_TRESH:
    unlock()

# Helpers for getting the current ms timestamp
def unix_time(dt):
    epoch = datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def unix_time_millis(dt):
    return unix_time(dt) * 1000.0
