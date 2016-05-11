import sublime
import os
import json
import platform

from .normalize_trailing_slash import normalize_trailing_slash
from .find_base_path import find_base_path
from .printer import p

def get_settings_from_source(source):
    settings = {}

    settings['root'] = normalize_trailing_slash(source.get('root', ''))
    # Kept for backCompat before other preprocessors were supported
    settings['sass_root'] = normalize_trailing_slash(source.get('sass_root', ''))
    settings['styles_root'] = normalize_trailing_slash(source.get('styles_root', ''))
    settings['config'] = source.get('config', '')
    settings['build_config'] = source.get('build_config', '')
    settings['webpack_config'] = source.get('webpack_config', '')
    settings['exclude'] = source.get('exclude', '')
    settings['node_path'] = source.get('node_path', '')

    # Users shouldn't need to worry about the leading colon (if necessary #124)
    if settings['node_path'] and not settings['node_path'].startswith(':') and platform.system() != 'Windows':
        settings['node_path'] = ':' + settings['node_path']

    if not settings['exclude']:
        settings['exclude'] = []

    if settings['sass_root'] and not settings['styles_root']:
        settings['styles_root'] = settings['sass_root']

    # Remove the legacy setting
    del settings['sass_root']

    p('Using these settings: ', settings)
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
