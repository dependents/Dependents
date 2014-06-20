import sublime, sublime_plugin
import subprocess
import threading
import os
from subprocess import Popen, PIPE

class DependentsCommand(sublime_plugin.WindowCommand):
  def run(self, root=''):

    self.window.root = root;

    thread = DependentsThread(self.window)
    thread.start();
    ThreadProgress(thread, 'Finding dependents', '')

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
        threading.Thread.__init__(self)

    def run(self):
        filename = self.view.file_name()

        if filename.find(self.window.root) == -1:
            print('Dependents: ' + filename + ' is not in the root directory')
            return

        # The part of the path before the root
        self.path = path = filename[:filename.index(self.window.root)]

        if (not os.path.exists(self.path + "/node_modules/dependents")):
            show_error('\nYou need to install the node tool "dependents" \n\nRun "npm install dependents" in your terminal')
            return

        cmd = ["/usr/local/bin/node", path + "node_modules/dependents/bin/dependents.js", filename, path + "public/assets/js"]
        dependents = Popen(cmd, stdout=PIPE).communicate()[0]
        self.dependents = dependents.decode('utf-8').split('\n')

        # We want the filepath minus the root and its trailing slash
        self.dependents = [dependent[dependent.index(self.window.root) + len(self.window.root) + 1:] for dependent in self.dependents if dependent]

        if len(self.dependents) == 1:
            self.open_file(self.dependents[0])
        else:
            sublime.set_timeout(self.show_quick_panel, 10)

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

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)

def show_error(string):
    """
    Displays an error message with a standard header

    :param string:
        The error to display
    """

    sublime.error_message(u'Dependents\n%s' % string)

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
