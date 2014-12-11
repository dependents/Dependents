import os

def is_sass_file(filename):
    """
    Whether or not the given filename is a Sass file
    """

    extension = os.path.splitext(filename)[1]
    print('ext: ', extension)
    print('filename: ', filename)

    return extension == '.scss' or extension == '.sass'
