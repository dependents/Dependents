import json
import sys
import traceback

if sys.version_info < (3,):
    from track import t
    from printer import p
    from node_dependents_editor_backend import backend
else:
    from .track import t
    from .printer import p
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
        traceback.print_exc()

        t("Setup Exception", {
            "message": e
        })

    return False