import sublime
import os
import json
import platform
import sys

if sys.version_info < (3,):
    from printer import p
else:
    from .printer import p

def get_project_settings(filename):
    """
    Returns a settings map that contains project settings
    either from a .deprc file or the plugin's sublime-settings file
    """
    project_settings_path = os.path.join(find_base_path(filename), '.deprc')

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

def get_settings_from_source(source):
    settings = {}

    settings['node_path'] = source.get('node_path', '')

    # Users shouldn't need to worry about the leading colon (if necessary #124)
    if settings['node_path'] and not settings['node_path'].startswith(':') and platform.system() != 'Windows':
        settings['node_path'] = ':' + settings['node_path']

    return settings

def find_base_path(filename):
    """
    Finds the most relevant folder to the currently active filename
    to serve as the base path of the current
    """
    starting_dir = os.path.dirname(filename)
    p('starting search for .deprc in: ', starting_dir)

    folder_with_deprc = get_folder_with_deprc(starting_dir)
    p('Closest folder with a deprc:', folder_with_deprc)

    return folder_with_deprc

def get_folder_with_deprc(baseFolder):
    if not baseFolder or baseFolder == '/':
        return ''

    deprc_file = os.path.join(baseFolder, '.deprc')

    if os.path.exists(deprc_file):
        return baseFolder
    else:
        return get_folder_with_deprc(os.path.dirname(baseFolder))
