import sys
from mock import Mock

sys.modules['sublime'] = Mock()
sys.modules['sublime_plugin'] = Mock()