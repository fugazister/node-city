var reportParser = function (report) {
  var index = 0,
      gutter = 1,
      parsed = report.reports[0].functions;

  var result = parsed.map(function (f) {
    var res = {
      x: index,
      y: 0,
      z: 0,
      height: 1,
      width: 1,
      depth: 1,
      color: '#fff'
    }
    index = index + gutter + 1;
    return res;
  });
  return result;
};

module.exports = {
  reportParser: reportParser
};
