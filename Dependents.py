import sublime, sublime_plugin
import subprocess
import threading
import os
import re
import time
from .thread_progress import ThreadProgress
from .node_dependents import get_dependents
from .command_setup import command_setup
from .show_error import show_error

class DependentsCommand(sublime_plugin.WindowCommand):
    def run(self, modifier=''):
        setup_was_successful = command_setup(self)

        if not setup_was_successful:
            print('Dependents: Setup was not successful')
            return

        self.view.modifier = modifier

        thread = DependentsThread(self.window, self.view)
        thread.start();

        ThreadProgress(thread, 'Finding dependents', '')

class DependentsThread(threading.Thread):
    """
    A thread to prevent the determination of the dependents from freezing the UI
    """
    def __init__(self, window, view):
        self.window = window
        self.view = view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the dependents of the current file and jumps to that file or shows a panel of dependent files
        """
        start_time = time.time()

        self.dependents = self.trim_paths(self.get_dependents())

        print('Dependents: Elapsed - %s seconds' % (time.time() - start_time))

        if self.view.modifier and self.view.modifier == 'OPEN_ALL':
            for dep in self.dependents:
                self.open_file(dep)
            return

        if len(self.dependents) == 1:
            self.open_file(self.dependents[0])
        else:
            sublime.set_timeout(self.show_quick_panel, 10)

    def get_dependents(self):
        """
        Asks the node tool for the dependents of the current module
        """
        root = self.view.path

        # In case the user supplied the base path as the root
        if self.window.root != self.view.path:
            root += self.window.root

        args = {
            'filename': self.view.filename,
            'root': root
        }

        if self.window.config:
            args['config'] = self.view.path + self.window.config

        dependents = get_dependents(args)
        print('Dependents found:')
        print('\n'.join(dependents))
        return dependents

    def trim_paths(self, files):
        """
        Returns the filepaths for each file minus the root and its trailing slash
        """
        trimmed = []

        for f in files:
            if f:
                try:
                    filename = f[f.index(self.window.root) + len(self.window.root):]
                except:
                    print('Didn\'t have root in path: ', f)
                    filename = f

                trimmed.append(filename)
        return trimmed

    def show_quick_panel(self):
        if not self.dependents:
            show_error('\nCan\'t find any file that depends on this file')
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
        filename = path + dependent

        if not os.path.isfile(filename):
            cant_find_file()
            return

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)

def cant_find_file():
    show_error('Can\'t find that file')
