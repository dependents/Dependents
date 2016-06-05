import sublime
import os
import json
import platform

from .normalize_trailing_slash import normalize_trailing_slash
from .printer import p

def get_settings_from_source(source):
    settings = {}

    settings['node_path'] = source.get('node_path', '')

    # Users shouldn't need to worry about the leading colon (if necessary #124)
    if settings['node_path'] and not settings['node_path'].startswith(':') and platform.system() != 'Windows':
        settings['node_path'] = ':' + settings['node_path']

    return settings

def get_project_settings():
    """
    Returns a settings map that contains project settings
    either from a .deprc file or the plugin's sublime-settings file
    """
    project_settings_path = os.path.join(find_base_path(), '.deprc')

    settings = {}

    if os.path.exists(project_settings_path):
        p('Using found .deprc within: ', project_settings_path)
        json_data = open(project_settings_path)
        data = json.load(json_data)
        json_data.close()

        settings = get_settings_from_source(data)
    else:
        p('Using default settings instead')

        settings = get_settings_from_source(sublime.load_settings('Dependents.sublime-settings'))

    return settings

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

def get_folder_with_deprc(baseFolder):
    if not baseFolder:
        return ''

    deprc_file = os.path.join(baseFolder, '.deprc')

    if os.path.exists(deprc_file):
        return baseFolder
    else:
        return get_folder_with_deprc(os.path.dirname(baseFolder))
