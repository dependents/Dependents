import sublime, sublime_plugin
import subprocess
import threading
import os
import re
from subprocess import Popen, PIPE
# TODO: Support Python 2 style imports
from .preconditions import met
from .thread_progress import ThreadProgress

class JumpToDependencyCommand(sublime_plugin.WindowCommand):
    def run(self):
        settings = sublime.load_settings('Dependents.sublime-settings')
        self.window.root    = settings.get('root');
        self.window.config  = settings.get('config');
        self.view           = self.window.active_view()
        self.view.filename  = self.view.file_name()
        # The part of the path before the root
        self.view.path      = self.view.filename[:self.view.filename.index(self.window.root)]
        # The path of the path after the root
        self.view.pathWithinRoot = self.view.filename[self.view.filename.index(self.window.root) + len(self.window.root):]

        if not met(self.view.path):
            return

        thread = JumpToDependencyThread(self.window, self.view)
        thread.start();

        ThreadProgress(thread, 'Jumping to dependency', '')

class JumpToDependencyThread(threading.Thread):
    """
    A thread to prevent the jump to dependency from freezing the UI
    """
    def __init__(self, window, view):
        self.window = window
        self.view = view
        threading.Thread.__init__(self)

    def run(self):
        """
        Jumps to the file identified by the string under the cursor
        """
        region = self.get_selected_module_region()

        module = self.view.substr(region).strip()
        module = re.sub('[\'",]', '', module)
        module = self.handleRelativePaths(module)

        # Lookup the module name, if aliased
        if self.window.config:
            result = self.aliasLookup(module, self.window.config)
            print('Lookup Result:', result)
            if result:
                module = result

        extension = os.path.splitext(module)[1]

        # Use the current file's extension if not supplied
        if (not extension):
            extension = os.path.splitext(self.view.filename)[1]

        file_to_open = module + extension

        self.open_file(file_to_open)

    def open_file(self, module):
        filename = self.view.path + self.window.root + '/' + module
        print('Opening: ', filename)
        if not os.path.isfile(filename):
            cant_find_file()
            return

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)

    def get_selected_module_region(self):
        selections = self.view.sel()

        if selections:
            region = selections[0]

            if region.a == region.b:
                selected_region = self.view.word(region)
                selected_line = self.view.line(region)

                line = self.view.substr(selected_line)
                pattern = '[\'"]{1}([^"\']*)[\'"]{1}'
                strings_on_line = re.findall(pattern, line)

                if not len(strings_on_line):
                    cant_find_file()
                    return

                # Get the locations of the strings within the buffer
                regions = map(lambda string: self.view.find_all(string), strings_on_line)
                regions = flatten(list(regions))
                # Get the regions that intersect with the clicked region
                region = list(filter(lambda r: r.contains(selected_region), regions))
                region = region[0]
                return region

        return None

    def handleRelativePaths(self, module):
        if (module.find('..') == 0 or module.find('.') == 0):
            fileDir = os.path.dirname(self.view.pathWithinRoot)
            module = os.path.normpath(os.path.join(fileDir, module))

            if (module[0] == '/'):
                module = module[1:]

        return module

    def aliasLookup(self, module, config):
        """
        Looks up the (possibly aliased) filename via the supplied config
        """

        cmd = [
            '/usr/local/bin/node',
            self.view.path + 'node_modules/dependents/bin/dependencyLookup.js',
            self.view.path + config,
            module
        ]

        print('Executing: ', ' '.join(cmd))

        result = Popen(cmd, stdout=PIPE).communicate()[0]
        return result.decode('utf-8').strip()


def flatten(nested):
    """
    Flattens a 2d array into a 1d array
    """
    return [item for sublist in nested for item in sublist]

def cant_find_file():
    show_error('Can\'t find that file')

def show_error(string):
    sublime.error_message(u'Dependents\n%s' % string)
