var test = require('tape').test;
var ossUrls = require('..');

test('toUrl', function(t) {
  var result = ossUrls.toUrl('oss-xx-xxxxx', 'bucket', 'key');
  t.equal(result.oss, 'oss://oss-xx-xxxxx/bucket/key', 'expected oss url');
  t.equal(result['bucket-in-host'], 'https://bucket.oss-xx-xxxxx.aliyuncs.com/key', 'expected bucket-in-host url');
  t.end();
});

test('fromUrl: unrecognized url', function(t) {
  var result = ossUrls.fromUrl('http://www.google.com');
  t.notOk(result.Region, 'no region');
  t.notOk(result.Bucket, 'no bucket');
  t.notOk(result.Key, 'no key');
  t.end();
});

test('fromUrl: oss style', function(t) {
  var result = ossUrls.fromUrl('oss://oss-xx-xxxxx/bucket/the/whole/key');
  t.equal(result.Region, 'oss-xx-xxxxx', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: oss bucket only style', function(t) {
  var result = ossUrls.fromUrl('oss://oss-xx-xxxxx/bucket');
  t.equal(result.Region, 'oss-xx-xxxxx', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, '', 'expected key');
  t.end();
});

test('fromUrl: oss bucket only style with slash', function(t) {
  var result = ossUrls.fromUrl('oss://oss-xx-xxxxx/bucket/');
  t.equal(result.Region, 'oss-xx-xxxxx', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, '', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host style', function(t) {
  var result = ossUrls.fromUrl('https://bucket.oss-cn-city.aliyuncs.com/the/whole/key');
  t.equal(result.Region, 'oss-cn-city', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host style in oss-cn-beijing', function(t) {
  var result = ossUrls.fromUrl('https://bucket.oss-cn-beijing.aliyuncs.com/the/whole/key');
  t.equal(result.Region, 'oss-cn-beijing', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('fromUrl: bucket-in-host dashed in oss-cn-beijing', function(t) {
  var result = ossUrls.fromUrl('https://bucket.oss-cn-beijing.aliyuncs.com/the/whole/key');
  t.equal(result.Region, 'oss-cn-beijing', 'expected region');
  t.equal(result.Bucket, 'bucket', 'expected bucket');
  t.equal(result.Key, 'the/whole/key', 'expected key');
  t.end();
});

test('convert: tileset templates', function(t) {
  t.equal(ossUrls.convert('https://bucket.oss-cn-city.aliyuncs.com/{z}/{x}/{y}', 'oss'), 'oss://oss-cn-city/bucket/{z}/{x}/{y}');
  t.end();
});

test('valid', function(t) {
  t.notOk(ossUrls.valid('http://www.google.com'), 'not on oss');
  t.ok(ossUrls.valid('https://bucket.oss-cn-city.aliyuncs.com/the/whole/key'), 'bucket in host');
  t.ok(ossUrls.valid('http://bucket.oss-cn-city.aliyuncs.com/the/whole/key'), 'http');
  t.ok(ossUrls.valid('oss://oss-cn-city/bucket/the/whole/key'), 'oss');
  t.end();
});
