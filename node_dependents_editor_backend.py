import sys
import sublime
import traceback

is_ST2 = sys.version_info < (3,)

if is_ST2:
    from lib.show_error import show_error
    from node_bridge import node_bridge
    from lib.track import t
    from lib.printer import p
    from lib.project_settings import get_project_settings
else:
    from .lib.show_error import show_error
    from .node_bridge import node_bridge
    from .lib.track import t
    from .lib.printer import p
    from .lib.project_settings import get_project_settings

def backend(options):
    args = []

    if 'filename' in options:
        args.append('--filename=' + options['filename'])

    if is_ST2:
        editor = 'ST2'
    else:
        editor = 'ST3'
    args.append('--editor=' + editor)

    if 'command' in options:
        args.append('--' + options['command'])

    if 'path' in options:
        args.append(options['path'])

    try:
        node_path = get_project_settings(options['filename']).get('node_path')
        p('node_path from settings: ', node_path)

        # TODO: It's not great to hardcode the Package name here but __file__ isn't consistent between Python 2 and 3
        bin_path = sublime.packages_path() + '/Dependents/node_modules/dependents-editor-backend/bin/cli.js'
        p('bin path', bin_path)

        return node_bridge(bin_path, args, node_path)

    except Exception as e:
        traceback.print_exc()
        show_error('An error occurred. Please file an issue with the following:\n\n' + str(e), True)

        t('Bridge_Error', {
            "message": str(e)
        })

    return ''
