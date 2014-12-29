import os
import platform

import sublime
from subprocess import Popen, PIPE
from os.path import dirname, realpath, join

from .lib.track import track as t
from .lib.show_error import show_error

"""
Modified version of node_bridge from sublime-fixmyjs
"""

IS_OSX = platform.system() == 'Darwin'
IS_WINDOWS = platform.system() == 'Windows'

def node_bridge(bin, args=[], data=''):
    env = None
    if IS_OSX:
        # GUI apps in OS X doesn't contain .bashrc/.zshrc set paths
        env = os.environ.copy()
        env['PATH'] += ':/usr/local/bin'

    try:
        cmd = ['node', bin] + args

        print('Executing: ', ' '.join(cmd))

        p = Popen(cmd,
            stdout=PIPE, stdin=PIPE, stderr=PIPE,
            env=env, shell=IS_WINDOWS)

    except OSError:
        raise Exception('Couldn\'t find Node.js. Make sure it\'s in your $PATH by running `node -v` in your command-line.')

    stdout, stderr = p.communicate(input=data.encode('utf-8'))
    stdout = stdout.decode('utf-8')
    stderr = stderr.decode('utf-8')

    if stderr:
        raise Exception('Error: %s' % stderr)
    else:
        return stdout

def exec_script(module, script, args):
    """
    Executes the cli-script for the given node module with the given args
    Returns the stdout result of that command
    """
    try:
        bin_path = join(sublime.packages_path(), dirname(realpath(__file__)), 'node_modules/' + module + '/bin/' + script)

        return node_bridge(bin_path, args)

    except Exception as e:
        show_error('An error occurred. Please file an issue with the following:\n\n' + str(e), True)

        t('Bridge_Error', {
            "message": str(e)
        })

    return ''