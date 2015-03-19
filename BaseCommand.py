import sublime_plugin
import time

# TODO: Support Python 2 style imports
from .lib.thread_progress import ThreadProgress
from .lib.show_error import *
from .lib.command_setup import command_setup
from .lib.track import track as t

class BaseCommand():
    def run(self, modifier='', edit=None):
        setup_was_successful = command_setup(self)

        if not setup_was_successful:
            show_error('Setup was not successful. Please file an issue', True)
            return

        if modifier:
            self.view.modifier = modifier

        if edit:
            self.view.edit = edit

    def init_thread(self, Thread, progress_message):
        thread = Thread(self)
        thread.start();

        ThreadProgress(thread, progress_message, '')

    # TODO: Move into a structure reusable with BaseThread
    def start_timer(self):
        self.total_start_time = time.time()

    def stop_timer(self, command_name):
        tracking_data = {
            'etime': time.time() - self.total_start_time,
        }

        t(command_name, tracking_data)