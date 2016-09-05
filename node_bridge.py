import os
import platform
import sys
from subprocess import Popen, PIPE

if sys.version_info < (3,):
    from lib.printer import p
else:
    from .lib.printer import p

"""
Modified version of node_bridge from sublime-fixmyjs
"""

IS_OSX = platform.system() == 'Darwin'
IS_WINDOWS = platform.system() == 'Windows'


def node_bridge(bin, args, node_path=None):
    env = None
    if IS_OSX:
        # GUI apps in OS X don't contain .bashrc/.zshrc set paths
        env = os.environ.copy()

        if not node_path:
            node_path = ':/usr/local/bin'

        p('Node path: ' + node_path)

        env['PATH'] += node_path

    try:
        cmd = ['node', bin] + args

        p('Executing: ', ' '.join(cmd))

        proc = Popen(cmd, stdout=PIPE, stdin=PIPE, stderr=PIPE, env=env, shell=IS_WINDOWS)

    except OSError:
        raise Exception('Couldn\'t find Node.js. Make sure it\'s in your $PATH by running `node -v` in your command-line.')

    stdout, stderr = proc.communicate(input=''.encode('utf-8'))
    stdout = stdout.decode('utf-8')
    stderr = stderr.decode('utf-8')

    if stderr:
        raise Exception('Error: %s' % stderr)
    else:
        return stdout
