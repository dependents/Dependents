import sys
import os

from .project_settings import get_project_settings
from .is_sass_file import is_sass_file
from .is_stylus_file import is_stylus_file
from .show_error import show_error
from .track import track as t
from .printer import p
from .find_base_path import find_base_path
from .is_relative_path import is_relative_path

def command_setup(self):
    """
    Series of common setup tasks across all commands

    self: WindowCommand context

    returns True for success, False for an error
    """

    try:
        return _init(self)
    except Exception as e:
        p(e)

        t("Setup Exception", {
            "message": e
        })

    return False

def _init(self):
    success = True

    self.view = self.window.active_view()
    self.view.filename = self.view.file_name()

    self.view.path = find_base_path()

    settings = get_project_settings()

    self.window.root = settings['root']
    self.window.styles_root = settings['styles_root']
    self.window.config = settings['config']
    self.window.exclude = settings['exclude']
    self.window.build_config = settings['build_config']

    if is_relative_path(self.window.root):
        self.window.root = self.view.path
        p('Relative root set set to', self.window.root)

    if is_relative_path(self.window.styles_root):
        self.window.styles_root = self.view.path
        p('Relative styles_root set to', self.window.styles_root)

    # All subsequent actions will be about the styles_root so just
    # switch the root to reduce the redundant checking if we should
    # use root or styles_root
    if is_sass_file(self.view.filename) or is_stylus_file(self.view.filename):
        if not self.window.styles_root:
            show_error('Please set the "styles_root" setting in your .deprc file', True)
            success = False

        self.window.root = self.window.styles_root

    elif not self.window.root:
        show_error('Please set the "root" setting in your .deprc file', True)
        success = False

    if not assert_paths_exist(settings):
        p('Found settings that do no exist')
        return False

    return success

def assert_paths_exist(paths):
    msg = 'The following setting paths do not exist:\n\n'
    found_non_existent_path = False

    p('asserting settings', paths)

    for setting, path in paths.items():
        p('setting: ', setting, ' | path: ', path)
        if type(path) == str and path and not os.path.lexists(path):
            found_non_existent_path = True
            msg += setting + ': ' + path + '\n'

    msg += '\nPlease correct your paths.'

    if found_non_existent_path:
        show_error(msg, True)
        return False

    return True