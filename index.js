var parse = require('url').parse;

var ossUrls = module.exports = {
  fromUrl: function(url) {
    var uri = parse(url);
    uri.pathname = decodeURIComponent(uri.pathname || '');

    var style = (function(uri) {
      if (uri.protocol === 'oss:' && /^oss-\w{2}-\w{4,20}$/.test(uri.hostname)) return 'oss';
      if (/\.oss-\w{2}-\w{4,20}\.?aliyuncs\.com/.test(uri.hostname)) return 'bucket-in-host';
    })(uri);

    var region, bucket, key;
    if (style === 'oss') {
      region = uri.hostname;
      bucket = uri.pathname.split('/')[1];
      key = uri.pathname.slice(bucket.length + 2);
    }
    if (style === 'bucket-in-host') {
      region = uri.hostname.split('.')[1];
      bucket = uri.hostname.split('.')[0];
      key = uri.pathname.slice(1);
    }

    return {
      Region: region,
      Bucket: bucket,
      Key: key
    };
  },

  toUrl: function(region, bucket, key) {
    return {
      'oss': [ 'oss:/', region, bucket, key ].join('/'),
      'bucket-in-host': [ 'https:/', bucket + '.' + region + '.aliyuncs.com', key ].join('/')
    };
  },

  convert: function(url, to) {
    var params = ossUrls.fromUrl(url);
    return ossUrls.toUrl(params.Region, params.Bucket, params.Key)[to];
  },

  valid: function(url) {
    var params = ossUrls.fromUrl(url);
    return params.Region && params.Bucket && params.Key;
  }
};
