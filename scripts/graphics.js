// ------------------------------------------------------------------
// 
// This is the graphics object.  It provides a pseudo pixel rendering
// space for use in demonstrating some basic rendering techniques.
//
// ------------------------------------------------------------------

MySample.graphics = (function(pixelsX, pixelsY, showPixels) {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d', { alpha: false });

    let deltaX = canvas.width / pixelsX;
    let deltaY = canvas.height / pixelsY;

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();

        //
        // Draw a very light background to show the "pixels" for the framebuffer.
        if (showPixels) {
            context.save();
            context.lineWidth = .1;
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.beginPath();
            for (let y = 0; y <= pixelsY; y++) {
                context.moveTo(1, y * deltaY);
                context.lineTo(canvas.width, y * deltaY);
            }
            for (let x = 0; x <= pixelsX; x++) {
                context.moveTo(x * deltaX, 1);
                context.lineTo(x * deltaX, canvas.width);
            }
            context.stroke();
            context.restore();
        }
    }

    //------------------------------------------------------------------
    //
    // Public function that renders a "pixel" on the framebuffer.
    //
    //------------------------------------------------------------------
    function drawPixel(x, y, color) {
        x = Math.trunc(x);
        y = Math.trunc(y);

        context.fillStyle = color;
        context.fillRect(x * deltaX, y * deltaY, deltaX, deltaY);
    }

    //------------------------------------------------------------------
    //
    // Helper function used to draw an X centered at a point.
    //
    //------------------------------------------------------------------
    function drawPoint(x, y, ptColor) {
        drawPixel(x - 1, y - 1, ptColor);
        drawPixel(x + 1, y - 1, ptColor);
        drawPixel(x, y, ptColor);
        drawPixel(x + 1, y + 1, ptColor);
        drawPixel(x - 1, y + 1, ptColor);
    }
    
    function drawLineBresenhamX(x1, y1, dx, dy, diffY, color){
        let plotX = x1;
        let plotY = y1;
        let pk = 2* dy - dx;
        let howMany = dx;
        while (howMany-- >=0){
            drawPixel(plotX, plotY, color);
            plotX++;
            if(pk >= 0){
                plotY += diffY;
                pk += (2 * dy - 2 * dx);
            }else{
                pk += 2 * dy;
            }
        }
    }
    function drawLineBresenhamY(x1, y1, dx, dy, diffX, color){
        let plotX = x1;
        let plotY = y1;
        let pk = 2* dx - dy;
        let howMany = dy;
        while (howMany-- >=0){
            drawPixel(plotX, plotY, color);
            plotX += diffX;
            if(pk >= 0){
                plotY++;
                pk += (2 * dx - 2 * dy);
            }else{
                pk += 2 * dx;
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------
    function drawLine(x1, y1, x2, y2, color) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        if(x2 >= x1 && y2 < y1 && dy >= dx){ // Octant // 0
            drawLineBresenhamY(x1, y1, dx, dy, 1, color);
        }
        else if (x2 > x1 && y2 <= y1 && dx > dy){ // Octant 1
            drawLineBresenhamX(x1, y1, dx, dy, -1, color);
        }
        else if (x2 > x1 && y2 > y1 && dx >= dy){ // Octant 2
            drawLineBresenhamX(x1, y1, dx, dy, 1, color);
        }
        else if (x2 >= x1 && y2 > y1 && dy > dx){ // Octant 3
            drawLineBresenhamY(x2, y2, dx, dy, -1, color);
        }
        else if (x2 < x1 && y2 > y1 && dy > dx){ // Octant 4 
            drawLineBresenhamY(x2, y2, dx, dy, 1, color);
        }
        else if(x2 < y1 && y2 >= y1 && dx >= dy){ // Octant 5
            drawLineBresenhamX(x2, y2, dx, dy, -1, color);
        }
        else if (x2 < x1 && y2 <= y1 && dx > dy){ // Octant 6
            drawLineBresenhamX(x2, y2, dx, dy, 1, color);
        }
        else if (x2 < x1 && y2 < y1 && dy >= dx){ // Octant 7
            drawLineBresenhamY(x1, y1, dx, dy, -1, color);
        }  
    }

    //------------------------------------------------------------------
    //
    // Renders an Hermite curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveHermite(controls, segments, showPoints, showLine, showControl, lineColor) {

        if(showControl){
            drawPixel(controls[0][0],controls[0][1], "yellow");
            drawPixel(controls[2][0],controls[2][1], "yellow");
        }
        // control point and slope for x(u)
        let p0_x = controls[0][0];
        let p1_x = controls[2][0];
        let p_0_x = controls[1][1];
        let p_1_x = controls[3][1];

        // control point and slopes for y(u)
        let p0_y = controls[0][1];
        let p1_y = controls[2][1];
        let p_0_y = controls[1][0];
        let p_1_y = controls[3][0];

        //segments difference
        let deltaU = 1/segments;
        let prevXU = 0;
        let prevYU = 0;


        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let xu = (p0_x*(2*(u**3)-3*(u**2) + 1) + p1_x*(-2*(u**3)+3*(u**2)) + p_0_x*(u**3 - 2*(u**2) + u) + p_1_x*(u**3 - u**2));
            let yu = (p0_y*(2*(u**3)-3*(u**2) + 1) + p1_y*(-2*(u**3)+3*(u**2)) + p_0_y*(u**3 - 2*(u**2) + u) + p_1_y*(u**3 - u**2));
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            if (showLine && i >= 1){
                drawLine(prevXU, prevYU, xu, yu, lineColor);
            }
            prevXU = xu;
            prevYU = yu;
            
        }
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor) {

        let t = controls[4][0];
        let s =  (1-t)/2;
        //pk and pk-1
        let pk_x = controls[0][0];
        let pkm1_x = controls[1][0];
        let pk_y = controls[0][1];
        let pkm1_y = controls[1][1];

        //pk+1 and pk+2
        let pkp1_x = controls[2][0];
        let pkp2_x = controls[3][0];
        let pkp1_y = controls[2][1];
        let pkp2_y = controls[3][1];

        let deltaU = 1/segments;
        let prevXU = 0;
        let prevYU = 0;

        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let xu = pkm1_x*(-s*(u**3) + 2*(s*(u**2))- (s*u)) + pk_x*((2-s)*(u**3) + (s-3)*(u**2) + 1) + pkp1_x*((s-2)*(u**3) + (3-2*s)*(u**2) + s*u) + pkp2_x*(s*(u**3) - s*(u**2));
            let yu = pkm1_y*(-s*(u**3) + 2*(s*(u**2))- (s*u)) + pk_y*((2-s)*(u**3) + (s-3)*(u**2) + 1) + pkp1_y*((s-2)*(u**3) + (3-2*s)*(u**2) + s*u) + pkp2_y*(s*(u**3) - s*(u**2));
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            if (showLine && i >= 1){
                drawLine(prevXU, prevYU, xu, yu, lineColor);
            }
            prevXU = xu;
            prevYU = yu;
        }     
    }

    function factorial(n){
        if (n==0 || n==1){
            return 1;
        }
        return factorial(n-1) * n;
    
    }
    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveBezier(controls, segments, showPoints, showLine, showControl, lineColor) {
        let n = 3;
        let prevXU = 0;
        let prevYU = 0;
        let deltaU = 1/segments

        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let xu = 0;
            let yu = 0;
            for(let k = 0; k <= n; k++){
                let c = factorial(n)/(factorial(k)*factorial(n-k));
                let BEZ = c * (Math.pow(u,k)) * Math.pow(1-u, n-k);
                xu = controls[k][0] * BEZ;
                yu = controls[k][1] * BEZ;
            }
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            if (showLine && i >= 1){
                drawLine(prevXU, prevYU, xu, yu, lineColor);
            }
            if(showControl){
                drawPoint(controls[0][0], controls[0][1], 'color')
                drawPoint(controls[2][0], controls[2][1], 'color')
                }
            prevXU = xu;
            prevYU = yu;
        }     

    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters; using the matrix form.
    // This follows the Mathematics for Game Programmers form.
    //
    //------------------------------------------------------------------
    function drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor) {
        
        if(showControl){
            drawPixel(controls[0][0],controls[0][1], "yellow");
            drawPixel(controls[2][0],controls[2][1], "yellow");
        }
        // control point and slope for x(u)
        let p0_x = controls[0][0];
        let p1_x = controls[2][0];
        let p_0_x = controls[1][0];
        let p_1_x = controls[3][0];

        // control point and slopes for y(u)
        let p0_y = controls[0][1];
        let p1_y = controls[2][1];
        let p_0_y = controls[1][1];
        let p_1_y = controls[3][1];

        //segments difference
        let deltaU = 1/segments;
        let prevXU = 0;
        let prevYU = 0;


        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let xu = (p0_x*(u**3) + p1_x*(-3*(u**3)+3*(u**2)) + p_0_x*(3*(u**3) - 6*(u**2) + 3*u) + p_1_x*(-1*(u**3) + 3*(u**2) - 3*(u) + 1));
            let yu = (p0_y*(u**3) + p1_y*(-3*(u**3)+3*(u**2)) + p_0_y*(3*(u**3) - 6*(u**2) + 3*u) + p_1_y*(-1*(u**3) + 3*(u**2) - 3*(u) + 1));
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            if (showLine && i >= 1){
                drawLine(prevXU, prevYU, xu, yu, lineColor);
            }
            prevXU = xu;
            prevYU = yu;
            
        }
    }

    //------------------------------------------------------------------
    //
    // Entry point for rendering the different types of curves.
    // I know a different (functional) JavaScript pattern could be used
    // here.  My goal was to keep it looking C++'ish to keep it familiar
    // to those not expert in JavaScript.
    //
    //------------------------------------------------------------------
    function drawCurve(type, controls, segments, showPoints, showLine, showControl, lineColor) {
        switch (type) {
            case api.Curve.Hermite:
                drawCurveHermite(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.Cardinal:
                drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.Bezier:
                drawCurveBezier(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
            case api.Curve.BezierMatrix:
                drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor);
                break;
        }
    }

    //
    // This is what we'll export as the rendering API
    const api = {
        clear: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        drawCurve: drawCurve
    };

    Object.defineProperty(api, 'sizeX', {
        value: pixelsX,
        writable: false
    });
    Object.defineProperty(api, 'sizeY', {
        value: pixelsY,
        writable: false
    });
    Object.defineProperty(api, 'Curve', {
        value: Object.freeze({
            Hermite: 0,
            Cardinal: 1,
            Bezier: 2,
            BezierMatrix: 3
        }),
        writable: false
    });

    return api;
}(1000, 1000, true));
