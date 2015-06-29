from Dependents.lib.is_stylus_file import is_stylus_file

class Test(object):
  def test_is_stylus_file(self):
    assert is_stylus_file('foo.styl') == True
    assert is_stylus_file('foo.py') == False
    assert is_stylus_file('foo') == False