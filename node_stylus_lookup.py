from .node_bridge import exec_script

def stylus_lookup(options):
    if 'filename' in options:
        args = ['--filename=' + options['filename']]

    if 'directory' in options:
        args.append('--directory=' + options['directory'])

    if 'path' in options:
        args.append(options['path'])

    return exec_script('stylus-lookup', 'cli.js', args).strip()