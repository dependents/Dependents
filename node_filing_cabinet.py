from .node_bridge import exec_script

def cabinet(options):
    if 'filename' in options:
        args = ['--filename=' + options['filename']]

    if 'directory' in options:
        args.append('--directory=' + options['directory'])

    if 'config' in options:
        args.append('--config=' + options['config'])

    if 'path' in options:
        args.append(options['path'])

    return exec_script('filing-cabinet', 'cli.js', args).strip()