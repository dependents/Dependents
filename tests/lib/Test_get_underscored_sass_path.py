from lib.get_underscored_sass_path import get_underscored_sass_path

class Test(object):
  def test_get_underscored_sass_path(self):
    assert get_underscored_sass_path('foo.scss') == '_foo.scss'
    assert get_underscored_sass_path('/usr/bar/foo.scss') == '/usr/bar/_foo.scss'
    assert get_underscored_sass_path('/usr/foo/foo.scss') == '/usr/foo/_foo.scss'
    assert get_underscored_sass_path('/usr/foo/_foo.scss') == '/usr/foo/_foo.scss'
