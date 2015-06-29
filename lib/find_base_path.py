import sublime
import os
from .normalize_trailing_slash import normalize_trailing_slash
from .printer import p

def find_base_path():
    """
    Finds the most relevant folder to the currently active filename
    to serve as the base path of the current
    """
    window = sublime.active_window()
    view = window.active_view()
    filename = view.file_name()

    # The base path is the folder with the closest deprc file
    folder_with_deprc = get_folder_with_deprc(os.path.dirname(filename));
    p('Closest folder with a deprc:', folder_with_deprc)

    return folder_with_deprc

# TODO: Move to node tool
def get_folder_with_deprc(baseFolder):
    if not baseFolder:
        return ''

    deprc_file = os.path.join(baseFolder, '.deprc')

    if os.path.exists(deprc_file):
        return baseFolder
    else:
        return get_folder_with_deprc(os.path.dirname(baseFolder))
