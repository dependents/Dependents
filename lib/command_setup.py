import json
import sys

if sys.version_info < (3,):
    from show_error import show_error
    from printer import p
    from node_dependents_editor_backend import backend
else:
    from .printer import p
    from .show_error import show_error
    from ..node_dependents_editor_backend import backend

def command_setup(self):
    """
    Series of common setup tasks across all commands

    self: WindowCommand context

    returns True for success, False for an error
    """

    try:
        success = True

        self.view = self.window.active_view()
        self.view.filename = self.view.file_name()

        config = backend({
            'filename': self.view.filename,
            'command': 'get-config'
        })

        self.window.config = json.loads(config)
        p('parsed config from backend', self.window.config)

        return success
    except Exception as e:
        p(e)
        show_error(e, True)

    return False
