import sublime

def show_error(string, should_show_more_info=False):
    message = 'Dependents\n\n%s' % string

    more_info = "For more info visit: https://github.com/mrjoelkemp/Dependents"

    if should_show_more_info:
        message += '\n\n%s' % more_info

    sublime.error_message(message)

def cant_find_file():
  show_error('Can\'t find that file')
