var assert = require('assert');
var sinon = require('sinon');
var q = require('q');
var rewire = require('rewire');

var numCores = require('os').cpus().length;

var WorkerManager = rewire('../../lib/WorkerManager');

describe('lib/WorkerManager', function () {
  beforeEach(function() {
    this.workerOptions = {
      directory: '',
      config: '',
      files: []
    };
  });

  describe('computeAllDependents', function () {
    it('spawns workers equal to the max number of cores', function() {
      var stub = sinon.stub().returns({id: 1});

      WorkerManager.__set__('fork', stub);

      sinon.stub(WorkerManager.prototype, '_assignWork');

      var manager = new WorkerManager(this.workerOptions);
      manager.computeAllDependents();

      assert.equal(stub.callCount, numCores);
      WorkerManager.prototype._assignWork.restore();
    });

    it('throws if not all of the given files were processed', function(done) {
      var deferred = q.defer();
      deferred.resolve();

      sinon.stub(WorkerManager.prototype, '_spawnWorkers').returns(deferred.promise);
      sinon.stub(WorkerManager.prototype, '_processedAllFiles').returns(false);

      var manager = new WorkerManager(this.workerOptions);
      manager.files = ['foo', 'bar'];
      manager.computeAllDependents()
      .catch(function() {
        WorkerManager.prototype._spawnWorkers.restore();
        WorkerManager.prototype._processedAllFiles.restore();
        done();
      });
    });

    it.skip('returns the list of found dependents');

    it.skip('assigns more work to finished workers');

    it.skip('kills workers when there are no files for them to process');

    it.skip('kills workers when they error');
  });
});