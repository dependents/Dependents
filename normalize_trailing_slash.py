def normalize_trailing_slash(string):
    """
    Ensures that the given string has a trailing slash
    """

    normalized = string

    if normalized and normalized[-1] != '/':
        normalized += '/'

    return normalized
