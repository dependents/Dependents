import sys
from .project_settings import get_project_settings
from .is_sass_file import is_sass_file
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
    except:
        t("Setup Exception", {
            "message": str(sys.exc_info()[0])
        })

    return False

def _init(self):
    success = True

    self.view = self.window.active_view()
    self.view.filename = self.view.file_name()

    self.view.path = find_base_path()

    settings = get_project_settings()

    self.window.root = settings['root']
    self.window.sass_root = settings['sass_root']
    self.window.config = settings['config']
    self.window.exclude = settings['exclude']
    self.window.build_config = settings['build_config']

    if is_relative_path(self.window.root):
        self.window.root = self.view.path
        p('Relative root set set to', self.window.root)

    if is_relative_path(self.window.sass_root):
        self.window.sass_root = self.view.path
        p('Relative sass_root set to', self.window.sass_root)

    # All subsequent actions will be about the sass_root so just
    # switch the root to reduce the redundant checking if we should
    # use root or sass_root
    if is_sass_file(self.view.filename):
        if not self.window.sass_root:
            show_error('Please set the "sass_root" setting in your .deprc file', True)
            success = False

        self.window.root = self.window.sass_root

    elif not self.window.root:
        show_error('Please set the "root" setting in your .deprc file', True)
        success = False

    return success
