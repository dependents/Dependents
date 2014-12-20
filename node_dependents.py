from subprocess import Popen, PIPE
from os.path import dirname, realpath, join
import sublime, sublime_plugin

from .node_bridge import node_bridge
from .show_error import show_error

from .track import track as t
from .printer import p

def get_dependents(options):
    try:
        args = [options['filename'], options['root']]
    except:
        t('Misc_Error', {
            "type": "filename or root not supplied"
        })

    try:
        if options['config']:
            args.append(options['config'])
    except:
        p('Dependents: Config not supplied')

    return exec_script('dependents.js', args).split('\n')

def alias_lookup(options):
    try:
        args = [options['config'], options['module']]
    except:
        args['', options['module']]

    return exec_script('dependencyLookup.js', args).strip()

def get_bin_path(script):
    return join(sublime.packages_path(), dirname(realpath(__file__)), 'node_modules/dependents/bin/' + script)

def exec_script(script, args):
    try:
        return node_bridge(get_bin_path(script), args)
    except Exception as e:
        show_error('An error occurred. Please file an issue with the following:\n\n' + str(e), True)
        t('Bridge_Error', {
            "message": str(e)
        })

    return ''