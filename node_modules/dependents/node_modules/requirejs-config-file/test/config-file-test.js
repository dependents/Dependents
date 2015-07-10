var path = require('path');
var chai = require('chai');
var fs = require('fs-extra');
var expect = chai.expect;
var assert = chai.assert;
//chai.use(require('./helpers/file'));

var tmpDir = "files/tmp/";
var tmpPath = function (relativePath) {
  return (tmpDir+relativePath).split(/\//).join(path.sep);
};

if (!fs.existsSync(path)) {
  fs.mkdirsSync(tmpDir);
}

var fixture = function(relativePath) {
  return ('files/fixtures/'+relativePath).split(/\//).join(path.sep);
};

// Class Under Test
var ConfigFile = require('../index').ConfigFile;

describe("ConfigFile", function() {

  describe("#read()", function () {

    describe("with a non-existing file", function() {
      var nonExistingFile = fixture('non-existing-config.js');
      var configFile = new ConfigFile(nonExistingFile);

      beforeEach(function(done) {
        if (fs.existsSync(nonExistingFile)) {
          fs.unlink(fixture('non-existing-config.js'), done);
        } else {
          done();
        }
      });

      it("it throws an error if file not found", function() {
        var read = function() {
          configFile.read();
        };

        expect(read).to.throw(/non-existing-config\.js/);
      });

      describe("when createIfNotExists() is used before", function() {
        beforeEach(function() {
          configFile.createIfNotExists();
        });

        it("returns a empty config", function() {
          var config = configFile.read();
          expect(config).to.exist.and.to.be.a('object').and.to.be.empty;
        });
      });
    });

    describe("with a requirejs.config() call with a define() in the file", function() {
      var configFile = new ConfigFile(fixture('config-with-define.js'));

      it("returns all the properties in the config", function() {
        var config = configFile.read();

        expect(config).to.include.keys('paths');
      });
    });


    describe("with a normal requirejs.config() call in the file", function() {
      var configFile = new ConfigFile(fixture('normal-config.js'));

      it("returns the config as an object", function() {
        var config = configFile.read();
        expect(config).to.exist.and.to.be.an('object');
      });

      it("returns all the properties in the config", function() {
        var config = configFile.read();

        expect(config).to.be.an('object').and.to.include.keys('paths');
      });
    });

    describe("with a var require definition", function() {
      var configFile = new ConfigFile(fixture('var-config.js'));

      it("returns the properties from config", function() {
        var config = configFile.read();
        expect(config).to.include.keys('paths');
      });
    });

    describe("with an parse error config", function() {
      var configFile = new ConfigFile(fixture('parse-error-config.js'));

      it("shows an error", function () {
        var read = function() {
          configFile.read();
        };

        expect(read).to.throw(/syntax error/);
      });
    });

    describe("with an empty config", function() {
      var configFile = new ConfigFile(fixture('empty-config.js'));

      it("reads the config file and returns an empty object without notice", function() {
        var config = configFile.read();

        expect(config).to.exist.and.to.be.a('object').and.to.be.empty;
      });
    });
  });

  describe("#write()", function() {
    var testModify = function(configName, modify, done) {
      var configFilePath = tmpPath(configName);
      fs.copy(fixture(configName), configFilePath, function (err) {
        expect(err).to.not.exist;

        var configFile = new ConfigFile(configFilePath);

        var config = configFile.read();

        modify(config);

        configFile.write();

        var expectedContents = fs.readFileSync(fixture('modified-'+configName)).toString();
        var actualContents = fs.readFileSync(configFilePath).toString();

        assert.equal(actualContents, expectedContents);
        done();
      });
    };

    it('writes the file with the modified config for a normal config', function (done) {
      testModify(
        'normal-config.js', 
        function (config) {
          config.paths['monster'] = '/path/to/monster';
        }, 
        done
      );
    });

    it('writes the file with the modified config for a var config', function (done) {
      testModify(
        'var-config.js', 
        function (config) {
          config.paths['lodash'] = '/path/to/lodash.min';
        },
        done
      );
    });

    it("writes an empty read config with a requirejs.config call", function(done) {
      testModify(
        'empty-config.js',
        function (config) {
          return config.baseUrl = './js-build/lib';
        },
        done
      );
    });

    describe('with a non existing file which is createIfNotExists() before', function () {
      var nonExistingFile = fixture('non-existing-config.js');
      var configFile = new ConfigFile(nonExistingFile);

      beforeEach(function(done) {
        if (fs.existsSync(nonExistingFile)) {
          fs.unlink(fixture('non-existing-config.js'), done);
        } else {
          done();
        }
      });

      it("writes the file", function() {
        configFile.createIfNotExists();
        configFile.write();
      });

      it("writes the file and creates directories", function() {
        var nonExistingFile = tmpPath('in/directory/non-existing-config.js');
        var configFile = new ConfigFile(nonExistingFile);

        configFile.createIfNotExists();
        configFile.write();
      });
    });
  });
});