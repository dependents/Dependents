import sublime, sublime_plugin
import threading
import json

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

from .lib.track import track as t
from .lib.printer import p
from .node_dependents_editor_backend import backend

class TreeCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if super(TreeCommand, self).run():
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

        config = backend({
            'filename': self.view.filename,
            'command': 'get-config'
        })

        config = json.loads(config)

        p('fetch parsed config from backend: ', config)

        tree = backend({
            'filename': self.view.filename,
            'command': 'get-tree'
        })

        tree = tree.replace(config['directory'] + '/', '')

        data = json.loads(tree)
        return json.dumps(data, indent=4)