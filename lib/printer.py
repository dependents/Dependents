import inspect
import os

def p(*messages):
  """
  Print helper for print the given message(s)
  prefixed with the filename
  """

  frame = inspect.stack()[1]
  filename = os.path.basename(frame[1])
  print(filename.replace('.py', '') + ':', ' '.join(str(s) for s in messages))