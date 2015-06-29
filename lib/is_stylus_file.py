import os

def is_stylus_file(filename):
    """
    Whether or not the given filename is a Stylus file
    """

    extension = os.path.splitext(filename)[1]

    return extension == '.styl'
