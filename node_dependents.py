from subprocess import Popen, PIPE
from os.path import dirname, realpath, join
import sublime, sublime_plugin

from .node_bridge import node_bridge

def get_dependents(options):
    args = [options['filename'], options['root']]

    if options['config']:
        args.append(options['config'])

    return node_bridge(get_bin_path('dependents.js'), args).split('\n')

def alias_lookup(options):
    args = [options['config'], options['module']]
    return node_bridge(get_bin_path('dependencyLookup.js'), args).strip()

def get_bin_path(script):
    return join(sublime.packages_path(), dirname(realpath(__file__)), 'node_modules/dependents/bin/' + script)
