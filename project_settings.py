import sublime, sublime_plugin
import os
import json

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

        settings = data
    else:
        sublime_settings = sublime.load_settings('Dependents.sublime-settings')
        try:
            settings['root'] = sublime_settings.get('root')
        except:
            settings['root'] = ''
        try:
            settings['config'] = sublime_settings.get('config')
        except:
            settings['config'] = ''
        try:
            settings['sass_root'] = sublime_settings.get('sass_root')
        except:
            settings['sass_root'] = ''

    return settings
