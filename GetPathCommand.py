import sublime, sublime_plugin
import os
import sys

if sys.version_info < (3,):
    from BaseCommand import BaseCommand
    from lib.printer import p
    from node_dependents_editor_backend import backend
else:
    from .BaseCommand import BaseCommand
    from .lib.printer import p
    from .node_dependents_editor_backend import backend

class GetPathCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if not super(GetPathCommand, self).run():
            return

        self.start_timer()

        path = backend({
            'filename': self.view.filename,
            'command': 'get-path'
        }).strip()

        p('Path:', path)

        sublime.set_clipboard(path);

        self.stop_timer('Get_Path')

