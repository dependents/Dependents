from .node_bridge import exec_script

def backend(options):
    if 'filename' in options:
        args = ['--filename=' + options['filename']]

    if 'directory' in options:
        args.append('--directory=' + options['directory'])

    if 'config' in options:
        args.append('--config=' + options['config'])

    if 'webpack_config' in options:
        args.append('--webpack-config=' + options['webpack_config'])

    if 'command' in options:
        args.append('--' + options['command'])

    if 'path' in options:
        args.append(options['path'])

    return exec_script('dependents-editor-backend', 'cli.js', args)