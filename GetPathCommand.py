import sublime, sublime_plugin
import os

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

from .lib.normalize_trailing_slash import normalize_trailing_slash
from .lib.printer import p
from .node_dependency_tree import get_tree

class GetPathCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if not super(GetPathCommand, self).run():
            return

        self.start_timer()

        root = normalize_trailing_slash(self.window.root)
        p('Root:', root)

        filename_no_ext = os.path.splitext(self.view.filename)[0]
        p('File w/o ext:', filename_no_ext)

        path = filename_no_ext.split(root)[1]
        p('Path:', path)

        sublime.set_clipboard(path);

        self.stop_timer('Get_Path')

