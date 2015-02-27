from Dependents.lib.project_settings import get_settings_from_source, get_project_settings
from mock import Mock, patch
import platform

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
    # Auto adds a colon
    'node_path': ':/usr/bin/local',
    'exclude': ['foo', 'bar']
}

class Test(object):
    def test_get_settings_from_source(self):
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

    def test_node_path_windows(self):
        example_path = 'C:\\Program Files\\nodejs'
        platform.system = Mock(return_value='Windows')

        with patch.dict(source, {'node_path': example_path}, clear=True):
            results = get_settings_from_source(source)
            # Should be untouched
            assert results['node_path'] == example_path

