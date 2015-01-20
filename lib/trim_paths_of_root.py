from .printer import p

def trim_paths_of_root(files, root):
    """
    Returns the filepaths for each file minus the root
    """
    trimmed = []

    for f in files:
        if f:
            try:
                filename = f[f.index(root) + len(root):]
            except:
                p('Didn\'t have root in path', f)
                filename = f

            trimmed.append(filename)
    return trimmed
