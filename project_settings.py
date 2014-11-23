import sublime, sublime_plugin
import os
import json

def get_settings_from_source(source):
    settings = {}

    settings['root'] = source.get('root', '')
    settings['config'] = source.get('config', '')
    settings['sass_root'] = source.get('sass_root', '')

    return settings

def get_project_settings(base_path):
    """
    Returns a settings map that contains project settings
    either from a .deprc file or the plugin's sublime-settings file
    """
    project_settings_path = base_path + '.deprc'

    settings = {}

    if os.path.exists(project_settings_path):
        print('Using found .deprc')
        json_data = open(project_settings_path)
        data = json.load(json_data)
        json_data.close()

        settings = get_settings_from_source(data)
    else:
        sublime_settings = sublime.load_settings('Dependents.sublime-settings')
        settings = get_settings_from_source(sublime_settings)

    return settings
