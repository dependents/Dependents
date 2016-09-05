import sublime
import threading
import os
import sys

if sys.version_info < (3,):
    from lib.printer import p
    from lib.show_error import *
else:
    from .lib.printer import p
    from .lib.show_error import *


class BaseThread(threading.Thread):
    """
    A thread to prevent the jump to dependency from freezing the UI
    """
    def __init__(self, window, view):
        self.window = window
        self.view = view
        threading.Thread.__init__(self)

    def run(self):
        pass

    def open_file(self, filename):
        """
        Opens the passed file or shows an error error message
        if the file cannot be found
        """
        p('Opening:', filename)

        location_less = filename
        location_colon_index = filename.find(':')

        if location_colon_index != -1:
            location_less = filename[:location_colon_index]

        p('Location-less filename: ' + location_less)

        if not filename or not os.path.isfile(location_less):
            cant_find_file()
            return

        def open():
            self.window.open_file(filename, sublime.ENCODED_POSITION)

        sublime.set_timeout(open, 10)
