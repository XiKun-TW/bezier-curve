var widthOffset = 60;
var heightOffset = 35;
var C = 0.552284749831;

function drawBezier(context, p0, c0, c1, p1) {
    context.save();
    context.beginPath();
    context.moveTo(p0.x, p0.y);
    context.bezierCurveTo(c0.x,c0.y,c1.x,c1.y,p1.x,p1.y);
    context.lineWidth = 2;
    context.strokeStyle = getColor(context);
    context.stroke();
    context.restore();
}

function clearCanvas(context) {
    if(context) {
      context.clearRect(0, 0, window.innerWidth, 300);
    }
  }

function drawBezierLines(context) {
    var p0 = { x: 0, y: 150 },
        c0 = { x: window.innerWidth/4, y: 10},
        c1 = { x: window.innerWidth/2, y: 300 },
        p1 = { x: window.innerWidth, y: 150 };
    var stepValue = 5;

    for(var i = 0; i < 15; i++) {
        p0.y += stepValue;
        c0.y += stepValue;
        c1.y -= stepValue;
        p1.y += stepValue;

        drawBezier(context, p0, c0, c1, p1);
    }
}

function getColor(context){
    if(context) {
      context.save();
      let gradient=context.createLinearGradient(0,0,1000,0);
      gradient.addColorStop("0","#ea4646");
      gradient.addColorStop("0.33","#44e2c0");
      gradient.addColorStop("0.66", "#f97ae4");
      gradient.addColorStop("1.0","#4833ea");
      context.restore();
      return gradient;
    }
    return 'white';
} 

function runBezierDemo(controlPointsCount, canvasId, dataset, isHidden) {
    var step = isHidden ?  dataset.prevstep : dataset.step;
    var bezierMaker;
    switch(step) {
        case "0": 
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            bezierMaker.drawAllPoints();
            break;
        case "1":
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            bezierMaker.clearCanvas();
            bezierMaker.drawAllPoints();
            bezierMaker.drawControlLine();
            break;
        case "2":
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            bezierMaker.clearCanvas();
            bezierMaker.drawAllPoints();
            bezierMaker.drawControlLine();
            bezierMaker.drawStepLine(bezierMaker.points, 0.1);
            break;
        case "3":
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            bezierMaker.clearCanvas();
            bezierMaker.drawAllPoints();
            bezierMaker.drawControlLine();
            bezierMaker.drawStepLine(bezierMaker.points, 0.1)
            function runDrawStepLine(t)  {
                setTimeout(function () {
                    bezierMaker.drawStepLine(bezierMaker.points, 0.1 * t)
                    if(t < 9) {
                        runDrawStepLine(t + 1);
                    }
                }, 500);
            }
            runDrawStepLine(2);
            break;
        case "4":
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            bezierMaker.startAnimateBezierCurve();
            break;
        case "5":
            bezierMaker = initCanvas(controlPointsCount, canvasId);
            var size = bezierMaker.getCanvasSize();
            var cirClePoints = getCirclePoints(size);

            function runMultiAnimation(step, runPoints = []) {
                if(step < cirClePoints.length) {
                    bezierMaker.points = cirClePoints[step];
                    bezierMaker.drawAllPoints(false);
                    bezierMaker.startAnimateBezierCurve(function() {
                        runPoints.push(bezierMaker.points);
                        runMultiAnimation(step + 1, runPoints);
                    }, 0.01, 2, runPoints);
                }
            }

            runMultiAnimation(0, []);
            break;
        default:
            bezierMaker = initCanvas(controlPointsCount, canvasId)
            bezierMaker.clearCanvas();
    }
}

function handleFragmentEvents(event, isHidden) {
    var dataset = event.fragment.dataset;
    if(dataset && dataset.type) {
        switch(dataset.type) {
            case 'simpleBezier': runBezierDemo(1, 'simpleBezier', dataset, isHidden); break;
            case 'cubicBezier': runBezierDemo(2, 'cubicBezier', dataset, isHidden); break;
            case 'colorfulBezier': runBezierDemo(3, 'colorfulBezier', dataset, isHidden); break;
            case 'fancyBezier':  fancyBezier(window, document.getElementById('fancyBezier')); break;
        }
    } 
}

function bindEvent() {
    Reveal.addEventListener('fragmentshown', function( event ) {
        handleFragmentEvents(event, false);
    } );

    Reveal.addEventListener('fragmenthidden', function( event ) {
        handleFragmentEvents(event, true);
    } );
}

function getPoints (canvasReactangle, controlPointsCount) {
    var points = [];
    points.push({x: widthOffset, y: canvasReactangle.height - heightOffset});
    for(var i = 0; i< controlPointsCount; i++) {
        points.push({ x: canvasReactangle.width * (i + 1) / (controlPointsCount + 1)  , y: 60 })
    }
    points.push({x: canvasReactangle.width - widthOffset, y: canvasReactangle.height - heightOffset});
    return points;
}

function getCirclePoints (canvasReactangle) {
    var cirClePoints = [];
    var height = canvasReactangle.height;
    var width = canvasReactangle.width;
    var center = { x: width / 2, y: height / 2};
    var mCircleRadius = width > height ? height / 2 - heightOffset : width / 2 - widthOffset;
    var mDifference = mCircleRadius * C;

    var points1 = [];
    points1.push({ x: center.x, y: center.y - mCircleRadius });
    points1.push({ x: center.x + mDifference, y: center.y - mCircleRadius });
    points1.push({ x: center.x +  mCircleRadius,  y: center.y  - mDifference });
    points1.push({ x: center.x +  mCircleRadius,  y: center.y });
    cirClePoints.push(points1);

    var points2 = [];
    points2.push({ x: center.x +  mCircleRadius,  y: center.y });
    points2.push({ x: center.x +  mCircleRadius,  y: center.y  + mDifference });
    points2.push({ x: center.x +  mDifference,  y: center.y + mCircleRadius});
    points2.push({ x: center.x, y: center.y + mCircleRadius });
    cirClePoints.push(points2);

    var points3 = [];
    points3.push({ x: center.x, y: center.y + mCircleRadius });
    points3.push({ x: center.x -  mDifference,  y: center.y + mCircleRadius}); 
    points3.push({ x: center.x - mCircleRadius,  y: center.y + mDifference });
    points3.push({ x: center.x - mCircleRadius,  y: center.y });
    cirClePoints.push(points3);

    var points4 = [];
    points4.push({ x: center.x - mCircleRadius,  y: center.y });
    points4.push({ x: center.x - mCircleRadius,  y: center.y - mDifference });
    points4.push({ x: center.x - mDifference, y: center.y - mCircleRadius });
    points4.push({ x: center.x, y: center.y - mCircleRadius });
    cirClePoints.push(points4);
    

    return cirClePoints;
}

function initCanvas(pointsCount, canvasId) {
    var bezier = new BezierMaker(document.getElementById(canvasId));
    bezier.setPoints(getPoints(bezier.getCanvasSize(), pointsCount));
    return bezier;
}

window.onload = function () {
    var canvas = this.document.getElementsByClassName('bezier-container')[0];
    var context = canvas.getContext('2d');
    if(context) {
        canvas.width = window.innerWidth;
        canvas.height = 300;

        drawBezierLines(context);
    }
    bindEvent();
}