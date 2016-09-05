import sublime
import sublime_plugin
import threading
import json
import sys

if sys.version_info < (3,):
    from BaseCommand import BaseCommand
    from BaseThread import BaseThread
    from node_dependents_editor_backend import backend
else:
    from .BaseCommand import BaseCommand
    from .BaseThread import BaseThread
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
        tree = self.get_results()

        sublime.set_timeout(lambda: self.open_new_file_with_results(tree), 100)

    def open_new_file_with_results(self, tree):
        new_file = self.window.new_file()
        new_file.set_syntax_file('Packages/JavaScript/JSON.tmLanguage')
        new_file.set_name('Tree for ' + self.view.file_name())
        new_file.run_command('insert_snippet', {'contents': tree})

    def get_results(self):
        """
        Asks the node tool for the dependents of the current module
        """
        tree = backend({
            'filename': self.view.filename,
            'command': 'get-tree'
        })

        tree = tree.replace(self.window.config['directory'] + '/', '')

        data = json.loads(tree)
        return json.dumps(data, indent=4)
