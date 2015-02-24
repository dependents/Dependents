from ...lib.project_settings import get_settings_from_source, get_project_settings

class Test(object):
    def test_get_settings_from_source(self):
        source = {
            'root': 'public/assets/js',
            'sass_root': 'public/assets/sass',
            'config': 'public/assets/my/config.js',
            'build_config': 'path/to/my/build.json',
            'node_path': '/usr/bin/local',
            'exclude': ['foo', 'bar']
        }

        expected = {
            'root': 'public/assets/js/',
            'sass_root': 'public/assets/sass/',
            'config': 'public/assets/my/config.js',
            'build_config': 'path/to/my/build.json',
            'node_path': ':/usr/bin/local',
            'exclude': ['foo', 'bar']
        }

        assert get_settings_from_source(source) == expected

    def test_get_settings_from_source_defaults(self):
        assert get_settings_from_source({}) == {
            'root': '',
            'sass_root': '',
            'config': '',
            'exclude': [],
            'build_config': '',
            'node_path': ''
        }

    # def test_get_project_settings(self):
    #     get_project_settings()