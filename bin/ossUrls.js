#!/usr/bin/env node

var ossUrls = require('..');

var argv = require('minimist')(process.argv.slice(2));

function usage() {
  console.log('ossurls from-url <url>');
  console.log('ossurls to-url <region> <bucket> <key> [--type [oss|bucket-in-host]]');
  console.log('ossurls convert <url> [--type [oss|bucket-in-host]]');
}

function fail(msg) {
  console.error(msg);
  usage();
  process.exit(1);
}

var command = argv._[0];
if (['to-url','from-url', 'convert', 'signed'].indexOf(command) === -1)
  return fail('ERROR: Invalid command');

if (command === 'from-url') {
  var url = argv._[1];
  if (!url) return fail('ERROR: No url given');

  var result = ossUrls.fromUrl(url);
  if (!result.Bucket || !result.Key) return fail('ERROR: Unrecognizable OSS url');

  console.log(JSON.stringify(result));
}

if (command === 'to-url') {
  var region = argv._[1];
  var bucket = argv._[2];
  var key = argv._[3];

  if (!region || !bucket || !key) return fail('ERROR: Must specify region, bucket and key');

  var result = ossUrls.toUrl(region, bucket, key);
  if (argv.type) return console.log(result[argv.type]);

  for (var k in result) {
    console.log(result[k]);
  }
}

if (command === 'convert') {
  var url = argv._[1];
  if (!url) return fail('ERROR: No url given');
  argv.type = argv.type || 'bucket-in-host';

  var check = ossUrls.fromUrl(url);
  if (!check.Region || !check.Bucket || !check.Key) return fail('ERROR: Unrecognizable OSS url');

  console.log(ossUrls.convert(url, argv.type));
}

