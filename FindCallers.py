import sublime, sublime_plugin
import subprocess
import threading
import os
import re
import time

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

from .lib.show_error import *
from .lib.trim_paths_of_root import trim_paths_of_root
from .lib.track import track as t
from .lib.printer import p

from .node_callers import find_callers

class FindCallersCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self, modifier=''):
        if super(FindCallersCommand, self).run(modifier):
            self.init_thread(FindCallersThread, 'Finding callers')

class FindCallersThread(BaseThread):
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the files that call the current file
        """
        self.start_timer()

        function_name = self.get_function_name()

        self.callers = trim_paths_of_root(self.get_callers(function_name), self.window.root)

        if self.view.modifier and self.view.modifier == 'OPEN_ALL':
            for driver in self.callers:
                self.open_file(driver)
            return

        if len(self.callers) == 1:
            self.open_file(self.callers[0])
        else:
            sublime.set_timeout(self.show_quick_panel, 10)

        self.stop_timer('Run_Find_Callers')

    def get_function_name(self):
        """
        TODO: Get the clicked word
        """
        selections = self.view.sel()
        if selections:
            region = selections[0]
            if region.a == region.b:
                selected_word = self.view.substr(self.view.word(region))

                print('selected word: ', selected_word)
                return selected_word

        return None

    def get_callers(self, function_name):
        """
        Asks the node tool for the drivers of the current module
        """
        root = self.view.path

        # In case the user supplied the base path as the root
        # TODO: Consider moving this to command_setup
        if self.window.root != self.view.path:
            root = os.path.join(root, self.window.root)

        args = {
            'filename': self.view.filename,
            'function_name': function_name,
            'root': root
        }

        if self.window.config:
            args['config'] = os.path.join(self.view.path, self.window.config)

        if self.window.exclude:
            args['exclude'] = ','.join(self.window.exclude)

        fetch_time = time.time()

        callers = [c for c in find_callers(args) if c]

        p('Fetch time:', time.time() - fetch_time)
        p(len(callers), 'callers found:\n' + '\n'.join(callers))

        return callers

    def show_quick_panel(self):
        if not self.callers:
            show_error('Can\'t find any callers of that function')
            return

        self.window.show_quick_panel(self.callers, self.on_done)

    def on_done(self, picked):
        if picked == -1:
            return

        caller = self.callers[picked]
        self.open_file(caller)

    def open_file(self, caller):
        # TODO: Duplicative of logic in get_callers
        path = self.view.path

        # In case the root is the directory root (path)
        if path != self.window.root:
            path = os.path.join(path, self.window.root)

        # We removed the root originally when populating the dependents list
        filename = path + caller

        super(FindCallersThread, self).open_file(filename)
