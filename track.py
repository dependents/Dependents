from .Mixpanel import *
import inspect
import os
import sys

def track(event, data = {}):
  """
  Handles logging to the console and Mixpanel

  Params:
    event
    [data] - Hash of any additional filtering params
    [data.etime] - Execution time
  """

  try:
    frame = inspect.stack()[1]
    filename = os.path.basename(frame[1])
    data['_filename'] = filename
  except:
    print('Could not pull filename')


  # Mixpanel doesn't like numerical values for properties
  # Round to 1 decimal for better grouping
  if 'etime' in data:
    data['etime'] = str(round(data['etime'], 1))

  try:
    mp = Mixpanel("668c67952eeebdfd690a6df83df70dda")
    mp.track('Dependents', event, data)

  except MixpanelException as e:
    print('Tracking not possible: ', e);

  finally:
    print(event, data)

