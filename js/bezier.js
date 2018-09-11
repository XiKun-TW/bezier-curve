class BezierMaker {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        if(this.context) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = BezierMaker.config.height;
        }   
    }

    factorial(number) {
        return number > 1 ? number * this.factorial(number - 1) : 1;
    }

    combination (n, i) {
        return this.factorial(n) / (this.factorial(n-i) * this.factorial(i));
    }

    getBezierPoint(t, points = this.points) {
        const n = points.length - 1;
        const result = { x: 0, y: 0 };
        for(let i=0; i<= n; i++) {
            result.x += this.combination(n,i) * points[i].x * Math.pow(1-t, n-i) * Math.pow(t, i);
            result.y += this.combination(n,i) * points[i].y * Math.pow(1-t, n-i) * Math.pow(t, i);
        }
        return result;
    }

    drawBezier(step, t = 1, points = this.points) {
        var startPoint = points[0];
        var currentPoint;
        for(var i = step; i<=t; i+=step) {
            currentPoint = this.getBezierPoint(i, points);
            this.drawLine(startPoint, currentPoint, 'red');
            startPoint = currentPoint;
        }
    }

    setPoints(points) {
        this.points = points;
    }

    getCanvasSize() { 
        return { width: this.canvas.width, height: this.canvas.height }; 
    }

    drawLine(startPoint, endPoint, color = BezierMaker.config.defaultColor, lineWidth = BezierMaker.config.defaultLineWidth) {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        this.context.moveTo(startPoint.x,startPoint.y);
        this.context.lineTo(endPoint.x,endPoint.y);
        this.context.stroke();
        this.context.restore();
    }

    getPathPoint(sPoint, ePoint, t) {
        const x = sPoint.x -ePoint.x;
        const y = sPoint.y -ePoint.y;
        
        return {
          x: sPoint.x - (sPoint.x - ePoint.x) * t,
          y: sPoint.y - (sPoint.y - ePoint.y) * t,
        }
    }

    drawStepLine(points, nStep, linWidth = 1, color = BezierMaker.config.defaultColor, drawPathPoint = true) {
        let stepPoints = [];
        for(let i=0; i<points.length-1; i++) {
            let pathPoint = this.getPathPoint(points[i], points[i+1], nStep);
            drawPathPoint && this.drawPoint(pathPoint, '');
            stepPoints.push(this.getPathPoint(points[i], points[i+1], nStep));
        }
        
        if(stepPoints.length >= 2) {
            for(let i=0; i< stepPoints.length-1; i++) {
                this.drawLine(stepPoints[i],stepPoints[i+1], color, linWidth);
            }
            if(stepPoints.length === 2) {
                const ePoint = this.getPathPoint(stepPoints[0], stepPoints[1], nStep);
                this.drawPoint(ePoint,'',false,'red');
            }
        }
        
        if(stepPoints.length > 2) {
            this.drawStepLine(stepPoints, nStep, linWidth, color, drawPathPoint);
        }
    }

    drawAllPoints() {
        this.clearCanvas();
        for(var i = 0; i < this.points.length; i++) {
            var isPoint = i === 0 || i === this.points.length -1 ;
            var pointsText = isPoint ? `${ i === 0 ? 'A' : 'B' }` : `C${i-1}`;
            this.drawPoint(this.points[i], pointsText, !isPoint);
        }
    }

    animateBezierCurve(t, step, delayTime, callBack, prevCurve = null) {
        this.clearCanvas();
        this.drawAllPoints();
        this.drawControlLine();
        if(prevCurve) {
            for(let i = 0; i < prevCurve.length; i++) {
                this.drawBezier(step, 1, prevCurve[i]);
                this.drawPoint(prevCurve[i][0], '', false, 'red');
                this.drawPoint(prevCurve[i][prevCurve[i].length-1], '', false, 'red');
            }
        }
        this.drawStepLine(this.points, t);
        this.drawBezier(step, t);
        if(t < 1) {
          setTimeout(() => this.animateBezierCurve(t + step, step, delayTime, callBack, prevCurve), delayTime);
        } else {
            if(t !== 1) {
                this.drawBezier(step);
            }

            callBack && callBack();
        }
    }

    startAnimateBezierCurve(callBack = null, nStep = BezierMaker.config.defaultStep, speed = BezierMaker.config.defaultAnimationSpeed, prevCurve = null) {
        let delayTime = speed * 1000 * nStep;
        this.animateBezierCurve(0, nStep, delayTime, callBack, prevCurve);
    }

    drawControlLine() {
        for(let i = 0; i< this.points.length - 1; i++) {
            this.drawLine(this.points[i], this.points[i+1], 'rgba(0, 0, 0, 0.5)');
        }
    }

    drawPoint(point, text, textOnTop = false, color = BezierMaker.config.defaultColor, pointSize = BezierMaker.config.defaultPointSize) {
        const vec = textOnTop ? -1 : 1;
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.arc(point.x, point.y , pointSize, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.fillStyle = color;
        this.context.font = "16px Arial";
        this.context.fillText(text, point.x - 10, point.y + vec * 20);
        this.context.stroke();
        this.context.restore();
    }

    clearCanvas() {
        if(this.context) {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

BezierMaker.config = {
    height: 400,
    defaultColor: 'black',
    defaultLineWidth: 3,
    defaultPointSize: 3,
    defaultStep: 0.001,
    defaultAnimationSpeed: 5,
}

window.BezierMaker = BezierMaker;