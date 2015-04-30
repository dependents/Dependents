import sublime
import threading
import os
import time

from .lib.printer import p
from .lib.track import track as t
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

        if not filename or not os.path.isfile(filename):
            t('Missing file', {
                'filename': filename
            })
            cant_find_file()
            return

        def open():
            self.window.open_file(filename)

        sublime.set_timeout(open, 10)

    def start_timer(self):
        self.total_start_time = time.time()

    def stop_timer(self, command_name):
        tracking_data = {
            'etime': time.time() - self.total_start_time,
        }

        try:
            tracking_data['modifier'] = self.view.modifier
        except Exception:
            pass

        t(command_name, tracking_data)
