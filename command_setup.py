from .project_settings import get_project_settings
from .normalize_trailing_slash import normalize_trailing_slash
from .is_sass_file import is_sass_file

def command_setup(self):
    """
    Series of common setup tasks across all commands

    self: WindowCommand context
    """
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

    if self.window.root == './' or self.window.root == '.':
        self.window.root = base_path

    # All subsequent actions will be about the sass_root so just
    # switch the root to reduce the redundant checking if we should
    # use root or sass_root
    if is_sass_file(self.view.filename):
        self.window.root = self.window.sass_root
