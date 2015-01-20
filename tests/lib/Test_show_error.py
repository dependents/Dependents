from lib.show_error import show_error
import sublime
from mock import MagicMock

class Test(object):
  def test_show_error(self):
      sublime.error_message = MagicMock()
      show_error('foobar')
      assert sublime.error_message.called