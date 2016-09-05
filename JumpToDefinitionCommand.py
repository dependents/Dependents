import sublime
import sublime_plugin
import threading
import sys

if sys.version_info < (3,):
    from BaseCommand import BaseCommand
    from BaseThread import BaseThread
    from lib.printer import p
    from node_dependents_editor_backend import backend
else:
    from .BaseCommand import BaseCommand
    from .BaseThread import BaseThread
    from .lib.printer import p
    from .node_dependents_editor_backend import backend


class JumpToDefinitionCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if super(JumpToDefinitionCommand, self).run():
            # Done on main thread due to ST2
            self.view.click_position = self.get_selection()
            self.init_thread(JumpToDefinitionThread, 'Jumping to definition')

    def get_selection(self):
        selections = self.view.sel()

        if not selections:
            return None

        region = selections[0]

        row, col = self.view.rowcol(region.a)

        p('clicked row: ', row)
        p('clicked col: ', col)
        p('region: ', region)

        # +1s to go from 0-based to 1-based line info
        return str(row + 1) + ',' + str(col + 1)


class JumpToDefinitionThread(BaseThread):
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        p('Extracted click position', self.view.click_position)

        file_to_open = backend({
            'filename': self.view.filename,
            'click_position': self.view.click_position,
            'command': 'jump-to-definition'
        }).strip()

        p('After jump to definition lookup', file_to_open)

        self.open_file(file_to_open)
