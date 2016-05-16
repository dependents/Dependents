from .printer import p
from .normalize_trailing_slash import normalize_trailing_slash

def trim_paths_of_root(files, root):
    """
    Returns the filepaths for each file minus the root
    """
    trimmed = []

    root = normalize_trailing_slash(root)

    for f in files:
        if f:
            try:
                filename = f[f.index(root) + len(root):]
                p('trimmed ', root, 'from', f, 'to', filename)
            except:
                p('Didn\'t have root', root, ' in path', f)
                filename = f

            trimmed.append(filename)
    return trimmed
