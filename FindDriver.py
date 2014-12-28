import sublime, sublime_plugin
import subprocess
import threading
import os
import re
import time

from .lib.thread_progress import ThreadProgress
from .lib.command_setup import command_setup
from .lib.show_error import *
from .lib.track import track as t
from .lib.printer import p

from .node_taxicab import find_driver

class FindDriverCommand(sublime_plugin.WindowCommand):
    def run(self, modifier=''):
        setup_was_successful = command_setup(self)

        if not setup_was_successful:
            show_error('Dependents: Setup was not successful. Please file an issue', True)
            return

        thread = FindDriverThread(self.window, self.view)
        thread.start();

        ThreadProgress(thread, 'Finding drivers', '')

class FindDriverThread(threading.Thread):
    def __init__(self, window, view):
        self.window = window
        self.view = view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the driver scripts that depend on the current file and
        jumps to that driver file or shows a panel of relevant driver scripts
        """
        total_start_time = time.time()

        self.drivers = trim_paths_of_root(self.get_drivers(), self.window.root)

        if self.view.modifier and self.view.modifier == 'OPEN_ALL':
            for driver in self.drivers:
                self.open_file(driver)
            return

        if len(self.drivers) == 1:
            self.open_file(self.drivers[0])
        else:
            sublime.set_timeout(self.show_quick_panel, 10)

        tracking_data = {
            "etime": time.time() - total_start_time,
        }

        if self.view.modifier:
            tracking_data["modifier"] = self.view.modifier

        t('Run_Find_Driver', tracking_data)

    def get_drivers(self):
        """
        Asks the node tool for the drivers of the current module
        """
        root = self.view.path

        # In case the user supplied the base path as the root
        # TODO: Consider moving this to command_setup
        if self.window.root != self.view.path:
            root += self.window.root

        args = {
            'filename': self.view.filename,
            'root': root
        }

        if self.window.config:
            args['config'] = self.view.path + self.window.config

        if self.window.build_config:
            args['build_config'] = self.view.path + self.window.build_config

        if self.window.exclude:
            args['exclude'] = ','.join(self.window.exclude)

        fetch_time = time.time()

        drivers = [d for d in find_driver(args) if d]

        p('Fetch time:', time.time() - fetch_time)
        p(len(drivers), 'drivers found:\n' + '\n'.join(drivers))

        return drivers

    def show_quick_panel(self):
        if not self.drivers:
            show_error('Can\'t find any driver that depends on this file')
            return

        self.window.show_quick_panel(self.drivers, self.on_done)

    def on_done(self, picked):
        if picked == -1:
            return

        driver = self.drivers[picked]
        self.open_file(driver)

    def open_file(self, driver):
        # TODO: Duplicative of logic in get_drivers
        path = self.view.path

        # In case the root is the directory root (path)
        if path != self.window.root:
            path += self.window.root

        # We removed the root originally when populating the dependents list
        filename = path + driver

        if not os.path.isfile(filename):
            t('Missing file', {
                "filename": filename
            })
            cant_find_file()
            return

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)