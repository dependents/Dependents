import sublime
from .normalize_trailing_slash import normalize_trailing_slash

def find_base_path():
    """
    Finds the most relevant folder to the currently active filename
    to serve as the base path of the current
    """
    window = sublime.active_window()
    filename = window.active_view().file_name()

    # Find the most relevant open folder
    for folder in window.folders():
        if folder in filename:
            return normalize_trailing_slash(folder)

    return ''
