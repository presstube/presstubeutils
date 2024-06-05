const cjs = createjs; // this will throw if createjs not already here
// figure that out someday maybe

const presstubeutils = {
  springMoveTo({ subject, target, parent, spring = 0.1, friction = 0.8 }) {
    let subjectPos = subject.localToLocal(0, 0, parent);
    let targetPos = target.localToLocal(0, 0, parent);
    if (!subject.vX) {
      subject.vX = 0;
    }
    if (!subject.vY) {
      subject.vY = 0;
    }
    subject.vX += (targetPos.x - subjectPos.x) * spring;
    subject.vY += (targetPos.y - subjectPos.y) * spring;
    subject.vX *= friction;
    subject.vY *= friction;
    subject.x += subject.vX;
    subject.y += subject.vY;
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
