import sublime, sublime_plugin
import subprocess
import threading
import os
import time
import json

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

from .lib.show_error import *
from .lib.track import track as t
from .lib.printer import p
from .lib.normalize_trailing_slash import normalize_trailing_slash
from .node_dependency_tree import get_tree

class TreeCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        super(TreeCommand, self).run()
        self.init_thread(TreeThread, 'Generating Tree')

class TreeThread(BaseThread):
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        """
        Finds the dependents of the current file and jumps to that file or shows a panel of dependent files
        """
        self.start_timer()

        tree = self.get_results()

        v = self.window.new_file()
        v.set_syntax_file('Packages/JavaScript/JSON.tmLanguage')
        v.set_name('Tree for ' + self.view.file_name())
        v.run_command('insert_snippet', {'contents': tree})

        self.stop_timer('Run_Tree')

    def get_results(self):
        """
        Asks the node tool for the dependents of the current module
        """
        root = self.view.path
        # In case the user supplied the base path as the root
        if self.window.root != self.view.path:
            root = os.path.normpath(os.path.join(root, self.window.root))

        tree = get_tree({
            'filename': self.view.filename,
            'root': root
        })

        tree = tree.replace(normalize_trailing_slash(root), '')

        data = json.loads(tree)
        return json.dumps(data, indent=4)