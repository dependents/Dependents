import os
import sublime, sublime_plugin
import platform
import subprocess
import threading

lookup = "where" if platform.system() == "Windows" else "which"

def met(absPathMinusRoot):
    """
    :param path
        The path to the current directory minus the root
    """
    # Check for node-dependents
    if not has_local_install(absPathMinusRoot):
        show_error("You need to install the node tool \"dependents\" globally\n\n" +
                  "Run \"npm install -g dependents\" in your terminal.")

        return False

    # Check for the settings to be set
    settings = sublime.load_settings('Dependents.sublime-settings')

    if not settings.get('root'):
        show_error("\nPlease set the \"root\" in the settings.\n\n" +
                  "Preferences -> Package Settings -> Dependents -> Settings - User\n\n" +
                  "Set it like: \n" +
                  "{\n" +
                  "\t\"root\": \"path/to/my/js\"\n"
                  "}")
        return False

    return True

def show_error(string):
    sublime.error_message(u'Dependents\n%s' % string)

def has_local_install(path):
    return os.path.exists(path + '/node_modules/dependents')
