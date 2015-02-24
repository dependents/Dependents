import sublime_plugin
# TODO: Support Python 2 style imports
from .lib.thread_progress import ThreadProgress
from .lib.show_error import *
from .lib.command_setup import command_setup

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