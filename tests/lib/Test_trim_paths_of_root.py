from lib.trim_paths_of_root import trim_paths_of_root

class Test(object):
    def test_trim_paths_of_root(self):
        files = [
            'foo/bar',
            'foo/baz',
            'foo/car'
        ]

        root = 'foo'

        trimmed = trim_paths_of_root(files, root)

        assert trimmed == ['/bar', '/baz', '/car']