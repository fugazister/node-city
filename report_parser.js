var reportParser = function (report) {
  var index = 0,
      scaleIndex = 10,
      gutter = 1 * scaleIndex,
      parsed = report.reports[0].functions;

  function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
  }

  function Color(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
          r = _r;
          g = _g;
          b = _b;
      };

      setColors(_r, _g, _b);
      this.getColors = function() {
          var colors = {
              r: r,
              g: g,
              b: b
          };
          return colors;
      };
  }

  var startColors = new Color(232, 9, 26).getColors();
  var endColors = new Color(6, 170, 60).getColors();

  var result = parsed.map(function (f) {
    var colorValue = f.cyclomaticDensity;

    var r = Interpolate(startColors.r, endColors.r, 100, colorValue);
    var g = Interpolate(startColors.g, endColors.g, 100, colorValue);
    var b = Interpolate(startColors.b, endColors.b, 100, colorValue);

    if (colorValue != null && colorValue != Infinity) {
      var color = "rgb(" + r + "," + g + "," + b + ")";
    } else {
      var color = "#fff";
    }

    var height = f.sloc.logical;

    var res = {
      name: f.name,
      x: index,
      y: 0,
      z: index % (10 * scaleIndex),
      height: height * scaleIndex,
      width: 1 * scaleIndex,
      depth: 1 * scaleIndex,
      color: color
    }
    index = index + gutter + 1 * scaleIndex;
    return res;
  });
  return result;
};

module.exports = {
  reportParser: reportParser
};
