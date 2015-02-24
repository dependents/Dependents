from lib.is_relative_path import is_relative_path

class Test(object):
  def test_is_relative_path(self):
    assert is_relative_path('foo/') == False
    assert is_relative_path('./foo') == True
    assert is_relative_path('./') == True
    assert is_relative_path('.') == True
    assert is_relative_path('') == False
    assert is_relative_path('/') == False