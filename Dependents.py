import sublime, sublime_plugin
import threading
import os

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

from .lib.show_error import *
from .lib.trim_paths_of_root import trim_paths_of_root
from .lib.track import track as t
from .lib.printer import p

from .node_dependents import get_dependents

class DependentsCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self, modifier=''):
        super(DependentsCommand, self).run(modifier)
        self.init_thread(DependentsThread, 'Finding dependents')

class DependentsThread(BaseThread):
    """
    A thread to prevent the determination of the dependents from freezing the UI
    """
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the dependents of the current file and jumps to that file or shows a panel of dependent files
        """
        self.start_timer()

        self.dependents = trim_paths_of_root(self.get_dependents(), self.window.root)

        if self.view.modifier == 'OPEN_ALL':
            for dep in self.dependents:
                self.open_file(dep)

        elif self.view.modifier == 'COPY_ALL':
            extLess = map(lambda d: os.path.splitext(d)[0], self.dependents)
            sublime.set_clipboard('\n'.join(extLess))

        elif len(self.dependents) == 1:
            self.open_file(self.dependents[0])

        else:
            sublime.set_timeout(self.show_quick_panel, 10)

        self.stop_timer('Run_Dependents')

    def get_dependents(self):
        """
        Asks the node tool for the dependents of the current module
        """
        root = self.view.path

        # In case the user supplied the base path as the root
        if self.window.root != self.view.path:
            root = os.path.normpath(os.path.join(root, self.window.root))

        args = {
            'filename': self.view.filename,
            'root': root
        }

        if self.window.config:
            args['config'] = os.path.normpath(os.path.join(self.view.path, self.window.config))

        if self.window.exclude:
            args['exclude'] = ','.join(self.window.exclude)

        # Newline in output is an empty dependent
        # TODO: Something to fix from node-dependents?
        dependents = [d for d in get_dependents(args) if d]

        p(len(dependents), 'dependents found:\n' + '\n'.join(dependents))

        return dependents

    def show_quick_panel(self):
        if not self.dependents:
            show_error('Can\'t find any file that depends on this file')
            return

        self.window.show_quick_panel(self.dependents, self.on_done)

    def on_done(self, picked):
        if picked == -1:
            return

        dependent = self.dependents[picked]
        self.open_file(dependent)

    def open_file(self, dependent):
        path = self.view.path

        # In case the root is the directory root (path)
        if path != self.window.root:
            path += self.window.root

        # We removed the root originally when populating the dependents list
        filename = os.path.normpath(os.path.join(path, dependent))
        super(DependentsThread, self).open_file(filename)
