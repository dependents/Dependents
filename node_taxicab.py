from .node_bridge import exec_script

def find_driver(options):
    if 'root' in options:
        args = ['--directory=' + options['root']]

    if 'config' in options:
        args.append('--config=' + options['config'])

    if 'build_config' in options:
        args.append('--build-config=' + options['build_config'])

    if 'exclude' in options:
        args.append('--exclude=' + options['exclude'])

    if 'filename' in options:
        args.append(options['filename'])

    return exec_script('taxicab', 'cli.js', args).split('\n')