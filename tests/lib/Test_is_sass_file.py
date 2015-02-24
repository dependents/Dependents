from ...lib.is_sass_file import is_sass_file

class Test(object):
  def test_is_sass_file(self):
    assert is_sass_file('foo.scss') == True
    assert is_sass_file('foo.sass') == True
    assert is_sass_file('foo.py') == False
    assert is_sass_file('foo') == False