import sublime, sublime_plugin
import threading
import os
import re
import time

from .BaseCommand import BaseCommand
from .BaseThread import BaseThread

# TODO: Support Python 2 style imports
from .lib.show_error import *
from .lib.find_file_like import find_file_like
from .lib.track import track as t
from .lib.printer import p
from .lib.flatten import flatten

from .node_filing_cabinet import cabinet

class JumpToDependencyCommand(BaseCommand, sublime_plugin.WindowCommand):
    def run(self):
        if super(JumpToDependencyCommand, self).run():
            self.init_thread(JumpToDependencyThread, 'Jumping to dependency')

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

        self.start_timer()

        module = self.get_selected_module_name()

        if not module:
            return

        p('Extracted Path', { 'path': module })

        # Requirejs lookup handles this automatically
        # Other lookups need a manual resolution
        if not self.window.config:
            module = self.handleRelativePaths(module)

        p('Before cabinet lookup', module)

        if self.window.config:
            config = os.path.normpath(os.path.join(self.view.path, self.window.config))
        else:
            config = ''

        if self.window.webpack_config:
            webpack_config = os.path.normpath(os.path.join(self.view.path, self.window.webpack_config))
        else:
            webpack_config = ''

        file_to_open = cabinet({
            'filename': self.view.filename,
            'directory': self.window.root,
            'path': module,
            'config': config,
            'webpack_config': webpack_config
        });

        p('After cabinet lookup', file_to_open)

        extension = os.path.splitext(file_to_open)[1]
        p('Extension found in dependency name', extension)

        # TODO: Move this lookup logic into a node tool
        # Use the current file's extension if not supplied
        if not extension:
            extension = os.path.splitext(self.view.filename)[1]
            file_to_open = file_to_open + extension

        # Assume the file is about the root
        # TODO: Does cabinet always return an absolute path?
        file_to_open = self.get_absolute_path(file_to_open)
        p('After abs path resolution', file_to_open)

        file_exists = os.path.isfile(file_to_open)
        if not file_exists:
            p('Module: ', module)
            p('Now searching for a file like', file_to_open)
            extensionless = os.path.splitext(file_to_open)[0]
            p('extensionless', extensionless)
            actual_file = find_file_like(extensionless)
            actual_file = os.path.join(os.path.dirname(file_to_open), actual_file)
            p('attempt to find like: ', actual_file)
            p('abs of find: ', os.path.join(os.path.dirname(file_to_open), actual_file))
            if os.path.isfile(actual_file):
                file_to_open = actual_file

        self.open_file(file_to_open)

        self.stop_timer('Run_JumpToDependency')

    def get_selected_module_region(self):
        """
        Returns the sublime region corresponding to the selected module path
        """
        selections = self.view.sel()

        if not selections:
            return None

        region = selections[0]

        if region.a != region.b:
            return None

        selected_region = self.view.word(region)
        selected_line = self.view.line(region)

        p('region', selected_region)
        p('line', selected_line)

        line = self.view.substr(selected_line)
        pattern = '[\'"]{1}([^"\']*)[\'"]{1}'
        strings_on_line = re.findall(pattern, line)

        p('strings on line', strings_on_line)

        # Try just grabbing an entire space-delimited word (potentially including slashes)
        if not len(strings_on_line):
            pattern = '[\s]{1}([^\s]*)'
            strings_on_line = re.findall(pattern, line)

        p('space delimited words on line', strings_on_line)

        if not len(strings_on_line):
            if selected_region:
                p('No strings found using word region:', self.view.substr(selected_region))
                return selected_region

            cant_find_file()
            return

        # Get the locations of the strings within the buffer
        regions = map(lambda string: self.view.find_all(string), strings_on_line)
        regions = flatten(list(regions))
        p('regions', regions)
        # Get the regions that intersect with the clicked region
        region = list(filter(lambda r: r.contains(selected_region), regions))

        if not len(region):
            # If they didn't click within the line and there's a path
            # on the line, just use the path
            if len(regions) == 1:
                region = regions
            else:
                return None

        return region[0]

    def get_selected_module_name(self):
        """
        Returns the name of the selected module
        """
        region = self.get_selected_module_region()

        if not region:
            t('Misc_Error', {
               'type': 'list index out of range'
            })
            show_error('You need to click within the quoted path')
            return

        module = self.view.substr(region).strip()
        module = re.sub('[\'",]', '', module)

        return module

    def handleRelativePaths(self, module):
        resolved = module

        if (module.find('..') == 0 or module.find('.') == 0):
            fileDir = os.path.dirname(self.view.filename)
            resolved = os.path.normpath(os.path.join(fileDir, module))

            p('Relative Path Resolved', {
                'module_resolved': module + ' => ' + resolved
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
            filename = os.path.normpath(os.path.join(filename, self.view.path))
            if root not in module and self.view.path != root:
                filename = os.path.normpath(os.path.join(filename, root))

        filename = os.path.normpath(os.path.join(filename, module))
        return filename
