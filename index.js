import _ from "lodash";
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

  springRotateToDegree({
    subject,
    targetDegree,
    spring = 0.1,
    friction = 0.8,
    offset = 0,
  }) {
    targetDegree = PTUtils.normalizeRotation(targetDegree);
    let subDeg = subject.rotation + offset;
    let totalDist = targetDegree - subDeg;
    if (!subject.vR) {
      subject.vR = 0;
    }
    if (totalDist < -180) {
      targetDegree += 360;
    } else if (totalDist > 180) {
      subDeg += 360;
    }
    totalDist = targetDegree - subDeg;
    subject.vR += totalDist * spring;
    subject.vR *= friction;
    subject.rotation += subject.vR;
    subject.rotation = PTUtils.normalizeRotation(subject.rotation);
  },

  springScaleTo({
    subject,
    targetScale,
    spring = 0.1,
    friction = 0.8,
    offset = 0,
  }) {
    let totalDist = targetScale - subject.scale;
    if (!subject.vS) {
      subject.vS = 0;
    }
    subject.vS += totalDist * spring;
    subject.vS *= friction;
    subject.scale += subject.vS;
  },

  loadAALib({ path, id }) {
    const AALibScript = document.createElement("script");
    return new Promise((resolve, reject) => {
      AALibScript.setAttribute("src", path);
      document.body.appendChild(AALibScript);
      AALibScript.addEventListener(
        "load",
        () => {
          let comp = AdobeAn.getComposition(id);
          document.body.removeChild(AALibScript);
          resolve({
            lib: comp.getLibrary(),
            domElement: AALibScript,
          });
        },
        false,
      );
    });
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

  makeCircle(color, radius) {
    var triangle = new cjs.Shape();
    triangle.graphics.beginFill(color).drawCircle(0, 0, radius);
    return triangle;
  },

  makeRect(color, x, y, w, h) {
    var rect = new cjs.Shape();
    rect.graphics.beginFill(color).drawRect(x, y, w, h);
    return rect;
  },

  makeFPSLabel() {
    let fpsLabel = new cjs.Text("-- fps", "bold 10px Arial", "#FFF");
    fpsLabel.x = 10;
    fpsLabel.y = 20;
    fpsLabel.addEventListener("tick", (e) => {
      // console.log(cjs.Ticker.getMeasuredFPS())
      fpsLabel.text = Math.round(cjs.Ticker.getMeasuredFPS()) + " FPS";
    });
    // fpsLabel.tick = function() {
    //  this.text = Math.round(cjs.Ticker.getMeasuredFPS()) + " FPS"
    // }
    return fpsLabel;
  },

  polarRadians(len, angleRadians) {
    return new cjs.Point(
      -len * Math.sin(-angleRadians),
      -len * Math.cos(-angleRadians),
    );
  },

  polarDegrees(len, angleDegrees) {
    return PTUtils.polarRadians(len, PTUtils.degreesToRads(angleDegrees));
  },

  degreesToRads(degrees) {
    return degrees * (Math.PI / 180);
  },

  radsToDegrees(rads) {
    var degrees = rads * (180 / Math.PI);
    if (degrees < -180) degrees += 360;
    return degrees;
  },

  distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  },

  angleRadians(p1, p2) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x) - Math.PI / 2;
  },

  angleDegrees(p1, p2) {
    return PTUtils.radsToDegrees(PTUtils.angleRadians(p1, p2));
  },

  getOppositeAngleRadians(radians) {
    return radians - Math.PI / 2 + Math.random() * Math.PI;
  },

  getAdjustedRotation(rotation) {
    if (rotation > 180) {
      rotation -= (Math.floor(rotation / 360) + 1) * 360;
    } else if (rotation < -180) {
      rotation += -Math.floor(rotation / 360) * 360;
    }
    return rotation;
  },

  addPoints(pointA, pointB) {
    return new cjs.Point(pointA.x + pointB.x, pointA.y + pointB.y);
  },

  setStrokeColor(item, color) {
    let currentFrame = item.currentFrame;
    let paused = item.paused;
    _.times(item.totalFrames, (frameIndex) => {
      item.gotoAndStop(frameIndex);
      _.times(item.children.length, (childIndex) => {
        if (item.children[childIndex].graphics._stroke) {
          item.children[childIndex].graphics._stroke.style = color;
        }
      });
    });
    item.gotoAndStop(currentFrame);
    if (!paused) item.play();
  },

  setStrokeWidth(item, width) {
    let currentFrame = item.currentFrame;
    let paused = item.paused;
    _.times(item.totalFrames, (frameIndex) => {
      item.gotoAndStop(frameIndex);
      _.times(item.children.length, (childIndex) => {
        if (item.children[childIndex].graphics._stroke) {
          item.children[childIndex].graphics._strokeStyle.width = width;
        }
      });
    });
    item.gotoAndStop(currentFrame);
    if (!paused) item.play();
  },

  setFillColor(item, color) {
    let currentFrame = item.currentFrame;
    let paused = item.paused;
    _.times(item.totalFrames, (frameIndex) => {
      item.gotoAndStop(frameIndex);
      _.times(item.children.length, (childIndex) => {
        if (item.children[childIndex].graphics._fill) {
          item.children[childIndex].graphics._fill.style = color;
        }
      });
    });
    item.gotoAndStop(currentFrame);
    if (!paused) item.play();
  },

  normalizeRotation(r) {
    r = r % 360; // normalize to 360
    if (r > 180) {
      return -(360 - r);
    } else if (r <= -180) {
      return 360 + r;
    } else {
      return r;
    }
  },

  isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  },

  shapeToInstructions(shape, scaler = 1) {
    const existingInstructions = _.cloneDeep(
      shape.graphics._activeInstructions,
    );
    const instructions = existingInstructions.map((instruction) => {
      const protoString = Object.getPrototypeOf(instruction).exec.toString();
      const match = protoString.match(/\.\s*(\w+)/);
      Object.keys(instruction).map((key) => {
        instruction[key] = instruction[key] * scaler;
      });
      return {
        operation: match[1],
        instruction,
      };
    });
    return instructions;
  },

  redrawShape(instructions, color = "#eee") {
    let s = new cjs.Shape();
    let g = s.graphics;
    g.beginFill(color);

    instructions.forEach(drawInstruction);

    function drawInstruction(instr) {
      const { operation, instruction } = instr;
      const vals = Object.values(instruction).map((val) => {
        return val;
      });
      g[operation](...vals);
    }

    return s;
  },

  makeNormals(instructions) {
    let normalsInstructions = _.clone(instructions);
    normalsInstructions.shift();
    normalsInstructions.pop();
    let normals = normalsInstructions.map((instruction, index) => {
      let instrA =
        index == 0
          ? instructions[instructions.length - 1]
          : instructions[index - 1];
      let instrB = instruction;
      let normal = makeNormal(instrA.instruction, instrB.instruction);
      return normal;
      function makeNormal(instrA, instrB) {
        let normal = new cjs.Shape();
        normal.graphics
          .beginStroke("blue")
          .setStrokeStyle(1)
          .moveTo(0, 0)
          .lineTo(0, -10);

        let angle = PTUtils.getAdjustedRotation(
          PTUtils.angleDegrees(instrA, instrB) - 90,
        );

        normal.x = instrB.x;
        normal.y = instrB.y;
        normal.rotation = angle;
        return normal;
      }
    });
    return normals;
  },

  shapeToInstructions(shape, scaler = 1) {
    const existingInstructions = _.cloneDeep(
      shape.graphics._activeInstructions,
    );
    const instructions = existingInstructions.map((instruction) => {
      const protoString = Object.getPrototypeOf(instruction).exec.toString();
      const match = protoString.match(/\.\s*(\w+)/);
      Object.keys(instruction).map((key) => {
        instruction[key] = instruction[key] * scaler;
      });
      return {
        operation: match[1],
        instruction,
      };
    });
    return instructions;
  },

  redrawShape(instructions, color = "#eee") {
    let s = new cjs.Shape();
    let g = s.graphics;
    g.beginFill(color);

    instructions.forEach(drawInstruction);

    function drawInstruction(instr) {
      const { operation, instruction } = instr;
      const vals = Object.values(instruction).map((val) => {
        return val;
      });
      g[operation](...vals);
    }

    return s;
  },

  makeNormals(instructions) {
    let normalsInstructions = _.clone(instructions);
    normalsInstructions.shift();
    normalsInstructions.pop();
    let normals = normalsInstructions.map((instruction, index) => {
      let instrA =
        index == 0
          ? instructions[instructions.length - 1]
          : instructions[index - 1];
      let instrB = instruction;
      let normal = makeNormal(instrA.instruction, instrB.instruction);
      return normal;
      function makeNormal(instrA, instrB) {
        let normal = new cjs.Shape();
        normal.graphics
          .beginStroke("blue")
          .setStrokeStyle(1)
          .moveTo(0, 0)
          .lineTo(0, -10);

        let angle = PTUtils.getAdjustedRotation(
          PTUtils.angleDegrees(instrA, instrB) - 90,
        );

        normal.x = instrB.x;
        normal.y = instrB.y;
        normal.rotation = angle;
        return normal;
      }
    });
    return normals;
  },
};

module.exports = PTUtils;
