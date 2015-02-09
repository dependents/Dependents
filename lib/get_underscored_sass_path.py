import os

def get_underscored_sass_path(path):
    """
    Returns a path with the underscored version of the current filename
    or the current path if already underscored
    """
    filename = os.path.basename(path)
    directory = os.path.dirname(path)

    if filename[0] == '_':
        return path

    return os.path.join(directory, '_' + filename)