import os
from fnmatch import fnmatch

def find_file_like(path):
    """
    Traverses the parent directory of path looking for the
    first file with a close enough name to the given path.

    This is helpful if you don't know the extension of a file
    (assuming the filename has a unique extension)
    """
    try:
        dirname = os.path.dirname(path)
        filename = [f for f in os.listdir(dirname) if fnmatch(f, os.path.basename(path) + '.*')]
        if len(filename):
            return filename[0]
    except:
        return ''

    return ''
