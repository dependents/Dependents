import sublime, sublime_plugin
import threading
import os
import sys

if sys.version_info < (3,):
    from BaseCommand import BaseCommand
    from BaseThread import BaseThread
    from lib.show_error import *
    from lib.trim_paths_of_root import trim_paths_of_root
    from lib.track import t
    from lib.printer import p
    from node_dependents_editor_backend import backend
else:
    from .BaseCommand import BaseCommand
    from .BaseThread import BaseThread
    from .lib.show_error import *
    from .lib.trim_paths_of_root import trim_paths_of_root
    from .lib.track import t
    from .lib.printer import p
    from .node_dependents_editor_backend import backend

class FindDriverCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self, modifier=''):
        if super(FindDriverCommand, self).run(modifier):
            self.init_thread(FindDriverThread, 'Finding relevant entry points')

class FindDriverThread(BaseThread):
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the driver scripts that depend on the current file and
        jumps to that driver file or shows a panel of relevant driver scripts
        """
        self.start_timer()

        self.drivers = trim_paths_of_root(self.get_drivers(), self.window.config['directory'])

        if self.view.modifier and self.view.modifier == 'OPEN_ALL':
            for driver in self.drivers:
                self.open_file(driver)

        elif len(self.drivers) == 1:
            self.open_file(self.drivers[0])

        else:
            sublime.set_timeout(self.show_quick_panel, 10)

        self.stop_timer('Run_Find_Driver')

    def get_drivers(self):
        """
        Asks the node tool for the drivers of the current module
        """

        args = {
            'filename': self.view.filename,
            'command': 'find-drivers'
        }

        drivers = [d for d in backend(args).split('\n') if d]

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
        filename = os.path.normpath(os.path.join(self.window.config['directory'], driver))
        super(FindDriverThread, self).open_file(filename)
