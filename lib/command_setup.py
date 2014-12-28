import sys
from .project_settings import get_project_settings
from .normalize_trailing_slash import normalize_trailing_slash
from .is_sass_file import is_sass_file
from .show_error import show_error
from .track import track as t

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

    self.view           = self.window.active_view()
    self.view.filename  = self.view.file_name()

    # Find the most relevant open folder
    for folder in self.window.folders():
        if folder in self.view.filename:
            base_path = normalize_trailing_slash(folder)
            break

    self.view.path = base_path

    settings = get_project_settings(base_path)

    self.window.root = settings['root']
    self.window.sass_root = settings['sass_root']
    self.window.config = settings['config']
    self.window.exclude = settings['exclude']
    self.window.build_config = settings['build_config']

    if self.window.root == './' or self.window.root == '.':
        self.window.root = base_path

    # All subsequent actions will be about the sass_root so just
    # switch the root to reduce the redundant checking if we should
    # use root or sass_root
    if is_sass_file(self.view.filename):
        if not self.window.sass_root:
            show_error('Please set the "sass_root" setting in \nPreferences -> Package Settings -> Dependents -> Settings - User', True)
            success = False

        self.window.root = self.window.sass_root

    elif not self.window.root:
        show_error('Please set the "root" setting in \nPreferences -> Package Settings -> Dependents -> Settings - User', True)
        success = False

    return success