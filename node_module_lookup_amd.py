from .node_bridge import exec_script

def module_lookup_amd(options):
    args = []

    if 'config' in options:
        args.append('--config=' + options['config'])

    if 'filename' in options:
        args.append('--filename=' + options['filename'])

    if 'module' in options:
        args.append(options['module'])

    return exec_script('module-lookup-amd', 'cli.js', args).strip()
