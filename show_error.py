import sublime, sublime_plugin

def show_error(string):
    sublime.error_message(u'Dependents\n%s' % string)
