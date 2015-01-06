from .node_bridge import exec_script

def find_callers(options):
    if 'root' in options:
        args = ['--directory=' + options['root']]

    if 'config' in options:
        args.append('--config=' + options['config'])

    if 'exclude' in options:
        args.append('--exclude=' + options['exclude'])

    if 'filename' in options:
        args.append(options['filename'])

    if 'function_name' in options:
        args.append(options['function_name'])

    return exec_script('callers', 'cli.js', args).split('\n')