import FileReader from 'ember-file-upload/system/file-reader';
import {
  module,
  test
} from 'qunit';

const FakeFileReader = {
  trigger: 'onload',
  abort() {
    this.onabort();
  },
  readAsArrayBuffer(blob) {
    this[this.trigger](blob);
  },
  readAsDataURL(blob) {
    this[this.trigger](blob);
  },
  readAsBinaryString(blob) {
    this[this.trigger](blob);
  },
  readAsText(blob) {
    this[this.trigger](blob);
  }
};

module('file-reader', {
  beforeEach() {
    this._FileReader = window.FileReader;
    window.FileReader = function () {
      return FakeFileReader;
    };
    this.subject = new FileReader();
  },
  afterEach() {
    this.subject = null;
    window.FileReader = this._FileReader;
  }
});

function testReadAs(name, blob='test') {
  test(`readAs${name}`, function (assert) {
    FakeFileReader.trigger = 'onload';
    FakeFileReader.result = 'ok';

    let promise = this.subject['readAs' + name](blob);
    return promise.then(function (result) {
      assert.equal(result, 'ok');
    });
  });

  test(`readAs${name} errored`, function (assert) {
    FakeFileReader.trigger = 'onerror';
    FakeFileReader.error = 'not ok';

    let promise = this.subject['readAs' + name](blob);
    return promise.then(null, function (error) {
      assert.equal(error, 'not ok');
    });
  });

  test(`readAs${name} cancelled`, function (assert) {
    FakeFileReader.trigger = 'onabort';

    let promise = this.subject['readAs' + name](blob);
    return promise.cancel().then(function () {
      assert.ok(true);
    });
  });
}

testReadAs('ArrayBuffer');
testReadAs('DataURL');
testReadAs('BinaryString');
testReadAs('Text');
