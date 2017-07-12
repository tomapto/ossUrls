var test = require('tape').test;
var exec = require('cross-exec-file');
var path = require('path');
var cmd = path.resolve(__dirname, '..', 'bin', 'ossUrls.js');

test('bad command', function(t) {
  exec(cmd, ['ham'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Invalid command\n', 'expected message');
    t.end();
  });
});

test('toUrl: bad args', function(t) {
  exec(cmd, ['to-url'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Must specify region, bucket and key\n', 'expected message');
    t.end();
  });
});

test('toUrl: all types', function(t) {
  expected = [
    'oss://oss-xx-xxxxx/bucket/key',
    'https://bucket.oss-xx-xxxxx.aliyuncs.com/key'
  ];

  exec(cmd, ['to-url', 'oss-xx-xxxxx', 'bucket', 'key'], function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    stdout.trim().split('\n').forEach(function(url) {
      t.ok(expected.indexOf(url) > -1, 'expected url');
    });
    t.end();
  });
});

test('toUrl: OSS type', function(t) {
  expected = 'oss://oss-xx-xxxxx/bucket/key';

  exec(cmd, ['to-url', 'oss-xx-xxxxx', 'bucket', 'key', '--type', 'oss'], function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    t.equal(stdout, expected + '\n', 'expected url');
    t.end();
  });
});

test('toUrl: bucket-in-host type', function(t) {
  expected = 'https://bucket.oss-xx-xxxxx.aliyuncs.com/key';

  exec(cmd, ['to-url', 'oss-xx-xxxxx', 'bucket', 'key', '--type', 'bucket-in-host'], function(err, stdout, stderr) {
    t.ifError(err, 'completed');
    t.equal(stdout, expected + '\n', 'expected url');
    t.end();
  });
});

test('fromUrl: no url', function(t) {
  exec(cmd, ['from-url'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: No url given\n', 'expected message');
    t.end();
  });
});

test('fromUrl: unrecognized url', function(t) {
  exec(cmd, ['from-url', 'http://www.google.com'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Unrecognizable OSS url\n', 'expected message');
    t.end();
  });
});

test('fromUrl: success', function(t) {
  exec(cmd, ['from-url', 'oss://oss-xx-xxxxx/bucket/key'], function(err, stdout, stderr) {
    t.equal(stdout, JSON.stringify({
      Region: 'oss-xx-xxxxx',
      Bucket: 'bucket',
      Key: 'key'
    }) + '\n', 'expected result');
    t.end();
  });
});

test('convert: no url', function(t) {
  exec(cmd, ['convert'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: No url given\n', 'expected message');
    t.end();
  });
});

test('convert: unrecognized url', function(t) {
  exec(cmd, ['convert', 'http://www.google.com'], function(err, stdout, stderr) {
    t.equal(err.code, 1, 'exit 1');
    t.equal(stderr, 'ERROR: Unrecognizable OSS url\n', 'expected message');
    t.end();
  });
});

test('convert: default success', function(t) {
  exec(cmd, ['convert', 'oss://oss-xx-xxxxx/bucket/key'], function(err, stdout, stderr) {
    t.equal(stdout, 'https://bucket.oss-xx-xxxxx.aliyuncs.com/key\n', 'expected result');
    t.end();
  });
});

test('convert: typed success', function(t) {
  exec(cmd, ['convert', 'oss://oss-xx-xxxxx/bucket/key', '--type', 'bucket-in-host'], function(err, stdout, stderr) {
    t.equal(stdout, 'https://bucket.oss-xx-xxxxx.aliyuncs.com/key\n', 'expected result');
    t.end();
  });
});
