from subprocess import Popen, PIPE
from os.path import dirname, realpath, join
import sublime, sublime_plugin

from .node_bridge import node_bridge
from .show_error import show_error

def get_dependents(options):
    try:
        args = [options['filename'], options['root']]
    except:
        print('Dependents: rilename or root not supplied')

    try:
        if options['config']:
            args.append(options['config'])
    except:
        print('Dependents: Config not supplied')

    try:
      return node_bridge(get_bin_path('dependents.js'), args).split('\n')
    except Exception as e:
      show_error(e)

def alias_lookup(options):
    try:
        args = [options['config'], options['module']]
    except:
        args['', options['module']]

    try:
      return node_bridge(get_bin_path('dependencyLookup.js'), args).strip()
    except Exception as e:
      show_error(e)

def get_bin_path(script):
    return join(sublime.packages_path(), dirname(realpath(__file__)), 'node_modules/dependents/bin/' + script)
