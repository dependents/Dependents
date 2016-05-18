import assert from 'assert';
import path from 'path';
import cli from '../../lib/cli';
import assign from 'object-assign';

describe('lib/cli', function() {
  beforeEach(function() {
    this._fixturePath = path.resolve(__dirname, '../fixtures');
  });

  describe('partial lookup', function() {
    describe('sass', function() {
      beforeEach(function() {
        this._directory = `${this._fixturePath}/sass`;
      });

      it('resolves non-underscored partials that have underscored file names', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['styles3.sass'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/_styles3.sass`);
        });
      });

      it('resolves underscored partials that have underscored filenames', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['_styles3.sass'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/_styles3.sass`);
        });
      });

      it('resolves partials without an explicit extension', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['styles3'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/_styles3.sass`);
        });
      });

      it('resolves partials in subdirectories', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['themes/dark'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/themes/dark.sass`);
        });
      });

      it('resolves doubly-quoted partials', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['"themes/dark"'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/themes/dark.sass`);
        });
      });

      it('resolves singly-quoted partials', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['\'themes/dark\''],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/themes/dark.sass`);
        });
      });

      it('resolves partials with a trailing semicolon', function() {
        return cli({
          filename: `${this._directory}/styles.sass`,
          directory: this._directory,
          args: ['styles3;'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/_styles3.sass`);
        });
      });
    });

    describe('scss', function() {
      beforeEach(function() {
        this._directory = `${this._fixturePath}/scss`;
      });

      it('resolves extensionless partials', function() {
        return cli({
          filename: `${this._directory}/site.scss`,
          directory: this._directory,
          args: ['vendors/_packages'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/vendors/_packages.scss`);
        });
      });

      it('resolves non-underscored partials that map to an underscored filename', function() {
        return cli({
          filename: `${this._directory}/site.scss`,
          directory: this._directory,
          args: ['vendors/packages'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/vendors/_packages.scss`);
        });
      });

      it('resolves partials with quotes and a trailing semicolon', function() {
        return cli({
          filename: `${this._directory}/site.scss`,
          directory: this._directory,
          args: ['"vendors/_packages.scss";'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/vendors/_packages.scss`);
        });
      });

      it('resolves relative partials', function() {
        return cli({
          filename: `${this._directory}/vendors/_packages.scss`,
          directory: this._directory,
          args: ['../mixins'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/_mixins.scss`);
        });
      });

      describe('when a partial\'s name matches a file in its directory and parent directory', function() {
        it('resolves to the file in its directory', function() {
          return cli({
            filename: `${this._directory}/utils/_debug.scss`,
            directory: this._directory,
            args: ['mixins'],
            lookup: true
          }).then(result => {
            assert.equal(result, `${this._directory}/utils/_mixins.scss`);
          });
        });
      });
    });

    describe('stylus', function() {
      beforeEach(function() {
        this._directory = `${this._fixturePath}/stylus`;
      });

      it('resolves .css partials', function() {
        return cli({
          filename: `${this._directory}/vendors/index.styl`,
          directory: this._directory,
          args: ['foo.css'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/vendors/foo.css`);
        });
      });

      it('resolves partials in the same directory', function() {

      });

      it('resolves partials in subdirectories', function() {
        return cli({
          filename: `${this._directory}/site.styl`,
          directory: this._directory,
          args: ['vendors/foo.css'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/vendors/foo.css`);
        });
      });

      it('resolves extensionless partials', function() {
        return cli({
          filename: `${this._directory}/site.styl`,
          directory: this._directory,
          args: ['utils/_functions'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/utils/_functions.styl`);
        });
      });

      it('resolves partials with extensions', function() {
        return cli({
          filename: `${this._directory}/site.styl`,
          directory: this._directory,
          args: ['utils/_functions.styl'],
          lookup: true
        }).then(result => {
          assert.equal(result, `${this._directory}/utils/_functions.styl`);
        });
      });

      describe('when given a directory as a partial', function() {
        it('resolves to the index.styl file of a directory', function() {
          return cli({
            filename: `${this._directory}/site.styl`,
            directory: this._directory,
            args: ['vendors'],
            lookup: true
          }).then(result => {
            assert.equal(result, `${this._directory}/vendors/index.styl`);
          });
        });
      });
    });

    describe('js', function() {
      describe('amd', function() {
        beforeEach(function() {
          this._directory = `${this._fixturePath}/javascript/amd/js`;

          this._run = (data = {}) => {
            return cli(assign({
              directory: this._directory,
              config: `${this._fixturePath}/javascript/amd/config.js`,
              lookup: true
            }, data));
          };
        });

        it('resolves aliased partials', function() {
          return this._run({
            filename: `${this._directory}/driver.js`,
            args: ['foobar']
          }).then(result => {
            assert.equal(result, `${this._directory}/b.js`);
          });
        });

        it('resolves unaliased partials', function() {
          return this._run({
            filename: `${this._directory}/driver.js`,
            args: ['./b']
          }).then(result => {
            assert.equal(result, `${this._directory}/b.js`);
          });
        });

        it('resolves relative partials', function() {
          return this._run({
            filename: `${this._directory}/b.js`,
            args: ['../config']
          }).then(result => {
            assert.equal(result, path.resolve(`${this._directory}`, '../') + '/config.js');
          });
        });

        it('resolves template imports', function() {
          return this._run({
            filename: `${this._directory}/b.js`,
            args: ['hgn!templates/face']
          }).then(result => {
            assert.equal(result, path.resolve(`${this._directory}`, '../templates') + '/face.mustache');
          });
        });

        it('resolves css imports', function() {
          return this._run({
            filename: `${this._directory}/b.js`,
            args: ['css!styles/styles']
          }).then(result => {
            assert.equal(result, path.resolve(`${this._directory}`, '../styles') + '/styles.css');
          });
        });

        it('resolves aliased partials to minified files', function() {
          return this._run({
            filename: `${this._directory}/driver.js`,
            args: ['jquery']
          }).then(result => {
            assert.equal(result, `${this._directory}/vendor/jquery.min.js`);
          });
        });
      });

      describe('es6', function() {
        beforeEach(function() {
          this._directory = `${this._fixturePath}/javascript/es6`;

          this._run = (data = {}) => {
            return cli(assign({
              directory: this._directory,
              lookup: true
            }, data));
          };
        });

        it('resolves relative partials', function() {
          return this._run({
            filename: `${this._directory}/index.js`,
            args: ['./foo']
          }).then(result => {
            assert.equal(result, `${this._directory}/foo.js`);
          });
        });

        it('resolves relative partials within a subdirectory', function() {
          return this._run({
            filename: `${this._directory}/lib/mylib.js`,
            args: ['../foo']
          }).then(result => {
            assert.equal(result, `${this._directory}/foo.js`);
          });
        });

        it('resolves subdirectory partials', function() {
          return this._run({
            filename: `${this._directory}/index.js`,
            args: ['./lib/mylib']
          }).then(result => {
            assert.equal(result, `${this._directory}/lib/mylib.js`);
          });
        });
      });

      describe('webpack', function() {
        beforeEach(function() {
          this._directory = `${this._fixturePath}/javascript/webpack`;

          this._run = (data = {}) => {
            return cli(assign({
              directory: this._directory,
              webpackConfig: `${this._fixturePath}/javascript/webpack/webpack.config.js`,
              lookup: true
            }, data));
          };
        });

        it('resolves aliased partials', function() {
          return this._run({
            filename: `${this._directory}/webpack/index.js`,
            args: ['R']
          }).then(result => {
            assert.equal(result, `${this._directory}/node_modules/is-relative-path/index.js`);
          });
        });

        it('resolves unaliased partials', function() {
          return this._run({
            filename: `${this._directory}/webpack/index.js`,
            args: ['./someModule']
          }).then(result => {
            assert.equal(result, `${this._directory}/someModule.js`);
          });
        });

        it.skip('resolves template partials', function() {
          return this._run({
            filename: `${this._directory}/webpack/index.js`,
            args: ['hgn!templates/foo']
          }).then(result => {
            assert.equal(result, `${this._directory}/templates/foo.mustache`);
          });
        });

        it.skip('resolves text partials', function() {
          return this._run({
            filename: `${this._directory}/webpack/index.js`,
            args: ['text!templates/foo.mustache']
          }).then(result => {
            assert.equal(result, `${this._directory}/templates/foo.mustache`);
          });
        });

        it.skip('resolves style partials', function() {
          return this._run({
            filename: `${this._directory}/webpack/index.js`,
            args: ['css!styles/foo']
          }).then(result => {
            assert.equal(result, `${this._directory}/styles/foo.css`);
          });
        });
      });
    });
  });
});
