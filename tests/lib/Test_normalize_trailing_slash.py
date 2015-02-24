from ...lib.normalize_trailing_slash import normalize_trailing_slash

class Test(object):
  def test_normalize_trailing_slash(self):
    assert normalize_trailing_slash('foo/') == 'foo/'
    assert normalize_trailing_slash('foo') == 'foo/'
    assert normalize_trailing_slash('') == ''