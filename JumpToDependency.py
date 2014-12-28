import sublime, sublime_plugin
import subprocess
import threading
import os
import re
import time
from fnmatch import fnmatch

# TODO: Support Python 2 style imports
from .lib.thread_progress import ThreadProgress
from .lib.show_error import show_error
from .lib.command_setup import command_setup

from .lib.track import track as t
from .lib.printer import p

from .node_dependents import alias_lookup

class JumpToDependencyCommand(sublime_plugin.WindowCommand):
    def run(self):
        setup_was_successful = command_setup(self)

        if not setup_was_successful:
            show_error('JumpToDependency: Setup was not successful. Please file an issue', True)
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

        total_start_time = time.time()

        try:
            region = self.get_selected_module_region()
        except:
            t('Misc_Error', {
               "type": "list index out of range"
            })
            show_error('You need to click within the quoted path')
            return

        module = self.view.substr(region).strip()
        module = re.sub('[\'",]', '', module)

        p('Extracted Path', { "path": module })

        module = self.handleRelativePaths(module)

        # Lookup the module name, if aliased
        if self.window.config:
            lookup_start_time = time.time()

            result = self.aliasLookup(module, self.window.config)

            p('Alias Lookup', {
                "module_result": module + ' => ' + result,
                "config": self.window.config,
                "etime": time.time() - lookup_start_time
            })

            if result:
                module = result

        extension = os.path.splitext(module)[1]
        p('Extension found', extension)

        # Use the current file's extension if not supplied
        if not extension:
            extension = os.path.splitext(self.view.filename)[1]
            module_with_extension = module + extension
        else:
            module_with_extension = module

        p('Before abs path resolution', module_with_extension)

        file_to_open = self.get_absolute_path(module_with_extension)
        p('After abs path resolution', file_to_open)

        # Our guess at the extension failed
        if not os.path.isfile(file_to_open):
            # Is relative to the module
            actual_file = find_file_like(module)
            if actual_file:
                extension = os.path.splitext(actual_file)[1]
                module_with_extension = module + extension
                file_to_open = self.get_absolute_path(module_with_extension)

        self.open_file(file_to_open)

        t('Run_JumpToDependency', {
            "etime": time.time() - total_start_time
        })

    def open_file(self, filename):
        """
        Opens the passed file or shows an error error message
        if the file cannot be found
        """

        p('Opening:', filename)

        if not os.path.isfile(filename):
            t('Missing file', {
                "filename": filename
            })
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
        resolved = module

        if (module.find('..') == 0 or module.find('.') == 0):
            fileDir = os.path.dirname(self.view.filename)
            resolved = os.path.normpath(os.path.join(fileDir, module))

            p('Relative Path Resolved', {
                "module_resolved": module + ' => ' + resolved
            })

        return resolved

    def get_absolute_path(self, module):
        """
        Returns a version of module that has the absolute path
        and root path baked in
        """
        filename = ''

        root = self.window.root

        # If it's an absolute path already, it was probably a module that uses plugin loader
        if self.view.path not in module:
            filename += self.view.path
            if root not in module and self.view.path != root:
                filename += root

        filename += module
        return filename

    def aliasLookup(self, module, config):
        """
        Looks up the (possibly aliased) filename via the supplied config
        """

        return alias_lookup({
            'config': self.view.path + config,
            'module': module
        })

def find_file_like(path):
    """
    Traverses the parent directory of path looking for the
    first file with a close enough name to the given path.

    This is helpful if you don't know the extension of a file
    (assuming the filename has a unique extension)
    """
    try:
        dirname = os.path.dirname(path)
        filename = [f for f in os.listdir(dirname) if fnmatch(f, os.path.basename(path) + '.*')]
        if len(filename):
            return filename[0]
    except:
        return ''

    return ''


def flatten(nested):
    """
    Flattens a 2d array into a 1d array
    """
    return [item for sublist in nested for item in sublist]

def cant_find_file():
    show_error('Can\'t find that file')
