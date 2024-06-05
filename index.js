const cjs = createjs; // this will throw if createjs not already here
// figure that out someday maybe

const presstubeutils = {
  distance(pt1, pt2) {
    // Implementation for distance calculation
    console.log("ptutils distance here!");
  },
  angle(pt1, pt2) {
    // Implementation for angle calculation
    console.log("ptutils angle here!");
  },
  fartypants(thePantsInWhichToFart) {
    // Implementation for fartypants
    console.log("ptutils fartypants here!");
  },

  makeTriangle(color, width, height) {
    var triangle = new cjs.Shape();
    triangle.graphics
      .beginFill(color)
      .lineTo(width / 2, 0)
      .lineTo(0, -height)
      .lineTo(-width / 2, 0)
      .lineTo(0, 0);
    return triangle;
  },
};

module.exports = presstubeutils;
