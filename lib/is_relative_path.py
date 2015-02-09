def is_relative_path(path):
    """
    Whether or not the given path is relative
    """
    return bool(path) and (path[:2] == './' or path[0] == '.')