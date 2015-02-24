import sublime
import os
import json
from .normalize_trailing_slash import normalize_trailing_slash
from .find_base_path import find_base_path
from .printer import p

def get_settings_from_source(source):
    settings = {}

    settings['root'] = normalize_trailing_slash(source.get('root', ''))
    settings['sass_root'] = normalize_trailing_slash(source.get('sass_root', ''))
    settings['config'] = source.get('config', '')
    settings['exclude'] = source.get('exclude', '')
    settings['build_config'] = source.get('build_config', '')
    settings['node_path'] = source.get('node_path', '')

    # Users shouldn't need to worry about the leading colon
    if settings['node_path'] and not settings['node_path'].startswith(':'):
        settings['node_path'] = ':' + settings['node_path']

    if not settings['exclude']:
        settings['exclude'] = []

    return settings

def get_project_settings():
    """
    Returns a settings map that contains project settings
    either from a .deprc file or the plugin's sublime-settings file
    """
    project_settings_path = find_base_path() + '.deprc'

    settings = {}

    if os.path.exists(project_settings_path):
        p('Using found .deprc')
        json_data = open(project_settings_path)
        data = json.load(json_data)
        json_data.close()

        settings = get_settings_from_source(data)
    else:
        settings = get_settings_from_source(sublime.load_settings('Dependents.sublime-settings'))

    return settings
