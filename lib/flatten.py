def flatten(nested):
    """
    Flattens a 2d array into a 1d array
    """
    return [item for sublist in nested for item in sublist]
