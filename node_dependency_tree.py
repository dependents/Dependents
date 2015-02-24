import time

from .node_bridge import exec_script
from .lib.printer import p

def get_tree(options):
    if 'root' in options:
        args = ['--directory=' + options['root']]

    if 'filename' in options:
        args.append(options['filename'])

    fetch_time = time.time()

    results = exec_script('dependency-tree', 'cli.js', args)

    p('Fetch time:', time.time() - fetch_time)

    return results