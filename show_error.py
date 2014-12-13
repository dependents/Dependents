import sublime, sublime_plugin

def show_error(string, should_show_more_info=False):
    message = 'Dependents\n\n%s' % string

    more_info = "For more info visit: https://github.com/mrjoelkemp/sublime-dependents"

    if should_show_more_info:
      message += '\n\n%s' % more_info

    sublime.error_message(message)
