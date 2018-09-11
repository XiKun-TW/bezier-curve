function fancyBezier(window, canvasEl) {
    var
    P2 = 2*Math.PI, RAD = Math.PI / 180,
    W = canvasEl.getAttribute('width'),
    H = canvasEl.getAttribute('height'),
    R = Math.min(W,H)/2, CX = W/2, CY = H/2,
    ctx = canvasEl.getContext('2d');
    
    function drawSpiral(ang, cx, cy, radius, segments, dir, aStart, aEnd, color) {
      aStart = aStart || 60;
      aEnd   = aEnd || 25;
  
      var
      segWidth = 360 / segments, hsla,
      i = 0, sR, eR, cAng, cp1x, cp1y, cp2x, cp2y, x, y;
      
      var
      halfRadius  = R / 2,
      startRadius = 0.75,
      startAngle  = (aStart * RAD)*dir,
      endRadius   = 0.75,
      endAngle    = (aEnd * RAD)*dir;
      
      for(; i < segments; i++) {
        cAng = (ang*RAD);
  
        x = cx + (R * Math.sin(cAng));
        y = cy + (R * Math.cos(cAng));
        
        hsla = (color === true ? 'hsl('+Math.round(i * segWidth)+', 100%, 65%)' : color);
        
        sR = halfRadius * startRadius;
        eR = halfRadius * endRadius;
  
        cp1x = cx + (sR * Math.sin(cAng + startAngle));
        cp1y = cy + (sR * Math.cos(cAng + startAngle));
  
        cp2x = cx + ((halfRadius + eR) * Math.sin(cAng + endAngle));
        cp2y = cy + ((halfRadius + eR) * Math.cos(cAng + endAngle));
        ang += (segWidth*dir);
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  
        if(hsla) {
          ctx.strokeStyle = hsla;
        }
  
        ctx.stroke();
        ctx.closePath();
      }
    }
    
    var
    color = true,
    durationStart = 32000, durationEnd = 8000,
    durationRotate = 60000,
    rotAngle, startAngle, endAngle, startPct, endPct;
  
    function loop(delta) {
      ctx.clearRect(0, 0, W, H);
      
      rotAngle   = (((delta%durationRotate)/durationRotate)*360);
      startAngle = (((delta%durationStart)/durationStart)*360);
      endAngle   = (((delta%durationEnd)/durationEnd)*360);
    
      drawSpiral(rotAngle, CX, CY, R, 50,  1, startAngle, endAngle, color);
      drawSpiral(rotAngle, CX, CY, R, 50, -1, startAngle, endAngle, color);
  
      window.requestAnimationFrame(loop.bind(this));
    }
  
    loop(0);
  
  };

  window.fancyBezier = fancyBezier;