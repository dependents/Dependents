import sublime, sublime_plugin
import subprocess
import threading
import os
import re
from subprocess import Popen, PIPE

MODES = {
    # find/jump-to the module dependent on the current module
    'DEPENDENTS': 'dependents',
    # jump-to the module identified by the string under your cursor
    'DEPENDENCY': 'dependency'
}

class DependentsCommand(sublime_plugin.WindowCommand):
    def run(self, root, mode=MODES['DEPENDENTS']):
        self.window.root = root;
        self.window.mode = mode;
        thread = DependentsThread(self.window)
        thread.start();

        if mode == MODES['DEPENDENTS']:
            msg = 'Finding dependents'
        elif mode == MODES['DEPENDENCY']:
            msg = 'Looking for that file'

        ThreadProgress(thread, msg, '')

class DependentsThread(threading.Thread):
    """
    A thread to prevent the determination of the dependents from freezing the UI
    """
    def __init__(self, window):
        """
        :param window:
            An instance of :class:`sublime.Window` that represents the Sublime
            Text window to show the list of installed packages in.
        """
        self.window = window
        self.view = window.active_view()
        self.filename = self.view.file_name()
        # The part of the path before the root
        self.path = self.filename[:self.filename.index(self.window.root)]
        # The path of the path after the root
        self.pathWithinRoot = self.filename[self.filename.index(self.window.root) + len(self.window.root):]
        threading.Thread.__init__(self)

    def run(self):
        mode = self.window.mode

        if mode == MODES['DEPENDENTS']:
            self.find_dependents()
        elif mode == MODES['DEPENDENCY']:
            self.find_dependency()

    def find_dependents(self):
        """
        Finds the dependents of the current file and jumps to that file or shows a panel of dependent files
        """
        if self.filename.find(self.window.root) == -1:
            print('Dependents: ' + self.filename + ' is not in the root directory')
            return

        if not os.path.exists(self.path + '/node_modules/dependents'):
            show_error('\nYou need to install the node tool "dependents" \n\nRun "npm install dependents" in your terminal')
            return

        cmd = ['/usr/local/bin/node', self.path + 'node_modules/dependents/bin/dependents.js', self.filename, self.path + 'public/assets/js']
        dependents = Popen(cmd, stdout=PIPE).communicate()[0]
        self.dependents = dependents.decode('utf-8').split('\n')

        # We want the filepath minus the root and its trailing slash
        self.dependents = [dependent[dependent.index(self.window.root) + len(self.window.root) + 1:] for dependent in self.dependents if dependent]

        if len(self.dependents) == 1:
            self.open_file(self.dependents[0])
        else:
            sublime.set_timeout(self.show_quick_panel, 10)

    def find_dependency(self):
        """
        Jumps to the file identified by the string under the cursor
        """
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

            highlighted = self.view.substr(region).strip()
            highlighted = re.sub('[\'",]', '', highlighted)

            # Handle relative paths, if any
            if (highlighted.find('..') == 0 or highlighted.find('.') == 0):
                fileDir = os.path.dirname(self.pathWithinRoot)
                highlighted = os.path.normpath(os.path.join(fileDir, highlighted))

                if (highlighted[0] == '/'):
                    highlighted = highlighted[1:]

            extension = os.path.splitext(highlighted)[1]

            if (not extension):
                extension = os.path.splitext(self.filename)[1]

            file_to_open = highlighted + extension

            self.open_file(file_to_open)

    def show_quick_panel(self):
        if not self.dependents:
            show_error('\nCan\'t find any file that depends on this file')
            return

        self.window.show_quick_panel(self.dependents, self.on_done)

    def on_done(self, picked):
        """
        Quick panel user selection handler - opens the selected dependent file

        :param picked:
            An integer of the 0-based dependent name index from the presented
            list. -1 means the user cancelled.
        """
        if picked == -1:
            return

        dependent = self.dependents[picked]
        self.open_file(dependent)

    def open_file(self, dependent):
        # We removed the root originally when populating the dependents list
        filename = self.path + self.window.root + '/' + dependent

        if not os.path.isfile(filename):
            cant_find_file()
            return

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)

def cant_find_file():
    show_error('Can\'t find that file')

def show_error(string):
    """
    Displays an error message with a standard header

    :param string:
        The error to display
    """
    sublime.error_message(u'Dependents\n%s' % string)

def flatten(nested):
        return [item for sublist in nested for item in sublist]

# From wbond/sublime_package_control
class ThreadProgress():
    """
    Animates an indicator, [=   ], in the status area while a thread runs

    :param thread:
        The thread to track for activity

    :param message:
        The message to display next to the activity indicator

    :param success_message:
        The message to display once the thread is complete
    """

    def __init__(self, thread, message, success_message):
        self.thread = thread
        self.message = message
        self.success_message = success_message
        self.addend = 1
        self.size = 8
        sublime.set_timeout(lambda: self.run(0), 100)

    def run(self, i):
        if not self.thread.is_alive():
            if hasattr(self.thread, 'result') and not self.thread.result:
                sublime.status_message('')
                return
            sublime.status_message(self.success_message)
            return

        before = i % self.size
        after = (self.size - 1) - before

        sublime.status_message('%s [%s=%s]' % \
            (self.message, ' ' * before, ' ' * after))

        if not after:
            self.addend = -1
        if not before:
            self.addend = 1
        i += self.addend

        sublime.set_timeout(lambda: self.run(i), 100)
