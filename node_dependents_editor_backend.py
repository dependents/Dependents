from .node_bridge import exec_script

def backend(options):
    if 'filename' in options:
        args = ['--filename=' + options['filename']]

    if 'command' in options:
        args.append('--' + options['command'])

    if 'path' in options:
        args.append(options['path'])

    return exec_script('dependents-editor-backend', 'cli.js', args)