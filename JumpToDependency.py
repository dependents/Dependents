import sublime_plugin
import threading
import re
import sys

if sys.version_info < (3,):
    from BaseCommand import BaseCommand
    from BaseThread import BaseThread
    from lib.show_error import *
    from lib.printer import p
    from node_dependents_editor_backend import backend
else:
    from .BaseCommand import BaseCommand
    from .BaseThread import BaseThread
    from .lib.show_error import *
    from .lib.printer import p
    from .node_dependents_editor_backend import backend

class JumpToDependencyCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if super(JumpToDependencyCommand, self).run():
            # Done on main thread due to ST2
            self.view.selection = self.get_selection()
            self.init_thread(JumpToDependencyThread, 'Jumping to dependency')

    def get_selection(self):
        """
        Returns the sublime region corresponding to the selected module path
        """
        selections = self.view.sel()

        if not selections:
            return None

        region = selections[0]

        clicked_position = region.a

        p('selections: ', selections)
        p('region: ', region)
        p('clicked char position: ', clicked_position)

        line = self.view.substr(self.view.line(region))
        p('line: ', line)
        p('line length: ', len(line))

        return {
            "clicked_position": clicked_position,
            "line": line
        }

class JumpToDependencyThread(BaseThread):
    """
    A thread to prevent the jump to dependency from freezing the UI
    """
    def __init__(self, command):
        self.window = command.window
        self.view = command.view
        threading.Thread.__init__(self)

    def run(self):
        """
        Jumps to the file identified by the string under the cursor
        """

        selection = self.view.selection

        p('Extracted Selection', selection)

        file_to_open = backend({
            'filename': self.view.filename,
            'path': selection.get('line'),
            'lookup_position': selection.get('clicked_position'),
            'command': 'lookup'
        }).strip()

        p('After cabinet lookup', file_to_open)

        self.open_file(file_to_open)
