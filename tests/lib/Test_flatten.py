from lib.flatten import flatten

class TestFlatten(object):
  def test_flatten(self):
    assert flatten([[1], [2]]) == [1, 2]