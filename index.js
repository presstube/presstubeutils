const cjs = createjs; // this will throw if createjs not already here
// figure that out someday maybe

const PTUtils = {
  ///////

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

  rotateToDegree({ subject, targetDegree, speed = 2, offset = 0 }) {
    targetDegree = PTUtils.normalizeRotation(targetDegree);
    let subDeg = subject.rotation + offset;
    let totalDist = targetDegree - subDeg;
    if (totalDist < -180) {
      targetDegree += 360;
    } else if (totalDist > 180) {
      subDeg += 360;
    }
    totalDist = targetDegree - subDeg;
    // subject.vR += totalDist * spring;
    // subject.vR *= friction;
    subject.rotation += totalDist / speed;
    subject.rotation = PTUtils.normalizeRotation(subject.rotation);
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

module.exports = PTUtils;
