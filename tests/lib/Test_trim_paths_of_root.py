from Dependents.lib.trim_paths_of_root import trim_paths_of_root

# TODO: Test that it handles when the path does not have foo in it
class Test(object):
    def test_trim_paths_of_root(self):
        files = [
            'foo/bar',
            'foo/baz',
            'foo/car'
        ]

        root = 'foo'

        trimmed = trim_paths_of_root(files, root)

        assert trimmed == ['bar', 'baz', 'car']