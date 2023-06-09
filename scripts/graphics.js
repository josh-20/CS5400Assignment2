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
    

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------
    function drawLine(x1, y1, x2, y2, color) {
        let deltaX = Math.abs(x2 - x1);
        let deltaY = Math.abs(y2 - y1);
        let m = deltaY/deltaX;
        let b = y1 - m * x1;
        let c = 2 * deltaY + (deltaX * (2 * b - 1));
        let pk = (2 * deltaY * x1) - (2 * deltaX * y1) + c;
        
        // Octant 0
        if(x1 <= x2 && y2 < y1 && deltaX < deltaY) {
            [deltaX,deltaY] = [deltaY,deltaX];
            m = deltaY/deltaX;
            b = y1 - m * x1;
            c = 2 * deltaY + (deltaX * (2 * b - 1));
            pk = (2 * deltaY * x1) - (2 * deltaX * y1) + c;
            for(let y = y1; y >= y2; y--){
                drawPixel(x1,y,color);
                if(pk >= 0) {
                    pk = pk + 2 * deltaY - 2 * deltaX;
                    x1++;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        // Octant 7
        else if(x1 > x2 && y2 < y1 && deltaX < deltaY) {
            [deltaX,deltaY] = [deltaY,deltaX];
            m = deltaY/deltaX;
            b = y1 - m * x1;
            c = 2 * deltaY + (deltaX * (2 * b - 1));
            pk = (2 * deltaY * x1) - (2 * deltaX * y1) + c;
            for(let y = y1; y >= y2; y--){
                drawPixel(x1,y,color);
                if(pk >= 0) {
                    pk = pk + 2 * deltaY - 2 * deltaX;
                    x1--;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        else if (x1 <= x2 && y1 < y2 && deltaX < deltaY){ // Octant 3
            [deltaX,deltaY] = [deltaY,deltaX];
            m = deltaY/deltaX;
            b = y1 - m * x1;
            c = 2 * deltaY + (deltaX * (2 * b - 1));
            pk = (2 * deltaY * x1) - (2 * deltaX * y1) + c;
            for(let y = y1; y <= y2; y++){
                drawPixel(x1,y,color);
                if(pk >= 0) {
                    pk = pk + 2 * deltaY - 2 * deltaX;
                    x1++;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        else if (x1 >= x2 && y1 < y2 && deltaX < deltaY){ // Octant 4
            [deltaX,deltaY] = [deltaY,deltaX];
            m = deltaY/deltaX;
            b = y1 - m * x1;
            c = 2 * deltaY + (deltaX * (2 * b - 1));
            pk = (2 * deltaY * x1) - (2 * deltaX * y1) + c;
            for(let y = y1; y <= y2; y++){
                drawPixel(x1,y,color);
                if(pk >= 0) {
                    pk = pk + 2 * deltaY - 2 * deltaX;
                    x1--;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }

        }
        // Octant 1
        else if(x1 <= x2 && (y2 - y1) >= 0){
            for(let x = x1; x <= x2; x++){
                drawPixel(x,y1,color);
                if(pk >= 0) {
                    pk = pk + ((2 * deltaY) - (2 * deltaX));
                    y1++;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        //Octant 2
       else if(x1 < x2 && y2 < y1){
            for(let x = x1; x < x2; x++){
                drawPixel(x,y1,color);
                if(pk >= 0) {
                    pk = pk + ((2 * deltaY) - (2 * deltaX));
                    y1--;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        // Octant 6
        else if (x2 <= x1 && y2 <= y1){
            for(let x = x1; x > x2; x--){
                drawPixel(x,y1,color);
                if(pk >= 0) {
                    pk = pk + ((2 * deltaY) - (2 * deltaX));
                    y1--;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
        }
        //Octant 5
        else if (x2 < x1 && y2 > y1){
            for(let x = x1; x > x2; x--){
                drawPixel(x,y1,color);
                if(pk >= 0) {
                    pk = pk + ((2 * deltaY) - (2 * deltaX));
                    y1++;
                }else{
                    pk = pk + (2 * deltaY);
                }
            }
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
            drawLine(controls[0][0], controls[0][1], controls[0][0] + controls[1][0], controls[0][1] + controls[1][1], "white");
            drawLine(controls[2][0], controls[2][1], controls[3][0] + controls[2][0], controls[3][1] + controls[2][1], "white");
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
        let prevXU = p0_x;
        let prevYU = p0_y;
        
        let optUHermite = function(){
            let memo = [];
            return function inner(u){
                if (memo[u] === undefined){
                    memo[u] = [2*(u**3)-3*(u**2) + 1,-2*(u**3)+3*(u**2),u**3 - 2*(u**2) + u, u**3 - u**2]
                }
                return memo[u];
            }
        }()
        let u = 0;
        for (let i = 0; i <= segments; i++){
            let optU = optUHermite(u)
            let xu = (p0_x*(optU[0]) + p1_x*(optU[1]) + p_0_x*(optU[2]) + p_1_x*(optU[3]));
            let yu = (p0_y*(optU[0]) + p1_y*(optU[1]) + p_0_y*(optU[2]) + p_1_y*(optU[3]));
            if (showLine){
                drawLine(prevXU, prevYU, xu, yu, lineColor);
            }
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            u += deltaU;
            prevXU = xu;
            prevYU = yu;
            
        }
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    let optCardinal = function(){
        let memo = [];
        return function inner(u,t){
            let s =  (1-t)/2;
            if (memo[u] === undefined){
                memo[u] = [];
                memo[u][t] = [-s*(u**3) + 2*(s*(u**2))- (s*u),(2-s)*(u**3) + (s-3)*(u**2) + 1,(s-2)*(u**3) + (3-2*s)*(u**2) + s*u, s*(u**3) - s*(u**2)];
            }else if (memo[u][t] === undefined){
                memo[u][t] = [-s*(u**3) + 2*(s*(u**2))- (s*u),(2-s)*(u**3) + (s-3)*(u**2) + 1,(s-2)*(u**3) + (3-2*s)*(u**2) + s*u, s*(u**3) - s*(u**2)];
            }
            return memo[u][t];
        } 
    }()

    function drawCurveCardinal(controls, segments, showPoints, showLine, showControl, lineColor) {
        if (showControl){
            drawPixel(controls.x[0],controls.y[0], "yellow");
            drawPixel(controls.x[2],controls.y[2], "yellow");
            drawLine(controls.x[0], controls.y[0], controls.x[0] + controls.x[1], controls.y[0] + controls.y[1], "white");
            drawLine(controls.x[2], controls.y[2], controls.x[3] + controls.x[2], controls.y[3]+ controls.y[2], "white");
        }

        let t = controls.t[0];
        //pk and pk-1
        let pk_x = controls.x[0];
        let pkm1_x = controls.x[1];
        let pk_y = controls.y[0];
        let pkm1_y = controls.y[1];

        //pk+1 and pk+2
        let pkp1_x = controls.x[2];
        let pkp2_x = controls.x[3];
        let pkp1_y = controls.y[2];
        let pkp2_y = controls.y[3];

        let deltaU = 1/segments;
        let prevXU = 0;
        let prevYU = 0;

        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let optUT = optCardinal(u,t);
            let xu = pkm1_x*(optUT[0]) + pk_x*(optUT[1]) + pkp1_x*(optUT[2]) + pkp2_x*(optUT[3]);
            let yu = pkm1_y*(optUT[0]) + pk_y*(optUT[1]) + pkp1_y*(optUT[2]) + pkp2_y*(optUT[3]);
            if (showLine && i >= 1){
                drawLine(xu, yu, prevXU, prevYU, lineColor);
            }
            if (showPoints){
                drawPoint(xu,yu,"yellow");
            }
            prevXU = xu;
            prevYU = yu;
        }     
    }

    // memoize for Bezier non matrix
    let factorial = function() {
        let f = [1, 1];
        return function inner(n){
            if(n > f.length - 1){
                f[n] = inner(n - 1) * n;
            }
            return f[n];
        }
    
    }();
    function compute(n,k){
        return factorial(n)/(factorial(k)*factorial(n-k));
    }
    let blendC = function(){
        let memo = []
        return function inner (n,k){
            if (n > memo.length - 1){
                memo[n] = [];
                memo[n][k] = compute(n,k);
            }else if (n < memo.length && k > memo[n].length - 1){
                memo[n][k] = compute(n,k);
            }
            return memo[n][k]
        }
    }()
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
        if(showControl){
            drawPixel(controls.x[0],controls.y[0], "yellow");
            drawPixel(controls.x[2],controls.y[2], "yellow");
            drawLine(controls.x[0], controls.y[0], controls.x[0] + controls.x[1], controls.y[0] + controls.y[1], "white");
            drawLine(controls.x[3], controls.y[3], controls.x[3] + controls.x[2], controls.y[3] + controls.y[2], "white");
        }
        let bezUMemo = function(){
            let memo = []
            return function inner(n,u,k){
                if (memo[n] === undefined){
                    memo[n] = [];
                }if (memo[n][k] === undefined){
                    memo[n][k] = [];
                }
                if (memo[n][k][u] === undefined){
                    let c = blendC(n,k); 
                    memo[n][k][u] = c*(u**k)*((1-u)**(n-k));
                }
                return memo[n][k][u];
            }   
        }()

        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let xu = 0;
            let yu = 0;
            for(let k = 0; k <= n; k++){
                let BEZ = bezUMemo(n,u,k);
                xu += controls.x[k] * BEZ;
                yu += controls.y[k] * BEZ;
            }
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
    // Renders a Bezier curve based on the input parameters; using the matrix form.
    // This follows the Mathematics for Game Programmers form.
    //
    //------------------------------------------------------------------
    function drawCurveBezierMatrix(controls, segments, showPoints, showLine, showControl, lineColor) {
        
        if(showControl){
            drawPixel(controls.x[0],controls.y[0], "yellow");
            drawPixel(controls.x[2],controls.y[2], "yellow");
            drawLine(controls.x[0], controls.y[0], controls.x[0] + controls.x[1], controls.y[0] + controls.y[1], "white");
            drawLine(controls.x[3], controls.y[3], controls.x[3] + controls.x[2], controls.y[3] + controls.y[2], "white");
        }
        // control point and slope for x(u)
        let p0_x = controls.x[0];
        let p1_x = controls.x[3];
        let p_0_x = controls.x[1];
        let p_1_x = controls.x[2];

        // control point and slopes for y(u)
        let p0_y = controls.y[0];
        let p1_y = controls.y[3];
        let p_0_y = controls.y[1];
        let p_1_y = controls.y[2];

        //segments difference
        let deltaU = 1/segments;
        let prevXU = 0;
        let prevYU = 0;

        let optUBezier = function(){
            let memo = [];
            return function inner(u){
                if (memo[u] === undefined){
                    memo[u] = [u**3, -3*(u**3)+3*(u**2), 3*(u**3) - 6*(u**2) + 3*u, -1*(u**3) + 3*(u**2) - 3*(u) + 1];
                }
                return memo[u];
            }
        }()
        for (let i = 0, u = 0; i <= segments; i++, u += deltaU){
            let optU = optUBezier(u);
            let xu = (p0_x*(optU[0]) + p_0_x*(optU[1]) + p_1_x*(optU[2]) + p1_x*(optU[3]));
            let yu = (p0_y*(optU[0]) + p_0_y*(optU[1]) + p_1_y*(optU[2]) + p1_y*(optU[3]));
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
// Renders a primitive of the form: {
//    verts: [ {x, y}, ...],    // Must have at least 2 verts
//    center: { x, y }
// }
// 
// connect: If true, the last vertex and first vertex have a line drawn between them.
//
// color: The color to use when drawing the lines
//
//------------------------------------------------------------------
function drawPrimitive(primitive, connect, color) {
    for(let i = 0; i < primitive.x.length; i++){
        drawPoint(primitive.x[i],primitive.y[i],"white");
        if(i >= 1){
            drawLine(primitive.x[i-1], primitive.y[i-1], primitive.x[i], primitive.y[i], color);
        }
    }
    if (connect){
        drawLine(primitive.x[0], primitive.y[0], primitive.x[primitive.x.length - 1], primitive.y[primitive.y.length - 1], color)
    }
    // drawPoint(primitive.center[0],primitive.center[1], "yellow");
    
}
//------------------------------------------------------------------
//
// Translates a point of the form: { x, y }
//
// distance: { x, y }
//
//------------------------------------------------------------------
function translatePoint(point, distance) {
    point.x += distance.x;
    point.y += distance.y;
    return point;
}
//------------------------------------------------------------------
//
// Scales a primitive of the form: {
    //    verts: [],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    //
// scale: { x, y }
//
//------------------------------------------------------------------
function scalePrimitive(primitive, scale) {
    for(let i = 0; i < primitive.x.length; i++){
        let t = translatePoint({x: primitive.x[i], y: primitive.y[i]},{x: -primitive.center[0], y: -primitive.center[1]});
        primitive.x[i] = t.x;
        primitive.y[i] = t.y;
        primitive.x[i] = scale.x * primitive.x[i];
        primitive.y[i] = scale.y * primitive.y[i];
        let t2 = translatePoint({x: primitive.x[i], y: primitive.y[i]}, {x: primitive.center[0], y: primitive.center[1]})
        primitive.x[i] = t2.x;
        primitive.y[i] = t2.y;
    }    
    drawPrimitive(primitive, true, "yellow");
}
//------------------------------------------------------------------
//
// Rotates a primitive of the form: {
    //    verts: [],    // Must have at least 2 verts
    //    center: { x, y }
    // }
    //
    // angle: radians
//
//------------------------------------------------------------------
function rotatePrimitive(primitive, angle) {
    for(let i = 0; i < primitive.x.length; i++){
        let t1 = translatePoint({x:primitive.x[i],y: primitive.y[i]}, {x: -primitive.center[0], y: -primitive.center[1]}); // translate in
        primitive.x[i] = (t1.x * Math.cos(angle) + (t1.y * -Math.sin(angle)));
        primitive.y[i] = (t1.x * Math.sin(angle) + (t1.y* Math.cos(angle)));
        let t2 = translatePoint({x:primitive.x[i],y: primitive.y[i]}, {x: primitive.center[0], y: primitive.center[1]});
        primitive.x[i] = t2.x;
        primitive.y[i] = t2.y;
    }

    // drawPrimitive(primitive,true,"orange");
}
//------------------------------------------------------------------
//
// Translates a primitive of the form: {
//    verts: [],    // Must have at least 2 verts
//    center: { x, y }
// }
//
// distance: { x, y }
//
//------------------------------------------------------------------
function translatePrimitive(primitive, distance) {
    primitive.center[0] += distance.x;
    primitive.center[1] += distance.y;
    for( let i = 0; i < primitive.x.length; i++){
        primitive.x[i] += distance.x;
        primitive.y[i] += distance.y;
    }
    drawPrimitive(primitive,true, 'pink');
}
//------------------------------------------------------------------
//
// Scales a curve relative to its center.
//    type: Cardinal, Bezier
//    controls: appropriate to the curve type
//    scale: { x, y }
//
//------------------------------------------------------------------
function scaleCurve(type, controls, scale) {
    for(let i = 0; i < controls.x.length; i++){
        let t = translatePoint({x: controls.x[i], y: controls.y[i]},{x: -controls.center[0], y: -controls.center[1]});
        controls.x[i] = t.x;
        controls.y[i] = t.y;
        controls.x[i] = scale.x * controls.x[i];
        controls.y[i] = scale.y * controls.y[i];
        let t2 = translatePoint({x: controls.x[i], y: controls.y[i]}, {x: controls.center[0], y: controls.center[1]})
        controls.x[i] = t2.x;
        controls.y[i] = t2.y;
    }       
}
//------------------------------------------------------------------
//
// Rotates a curve about its center.
//    type: Cardinal, Bezier
//    controls: appropriate to the curve type
//    angle: radians
//
//------------------------------------------------------------------
function rotateCurve(type, controls, angle) {
    for(let i = 0; i < controls.x.length; i++){
        let t1 = translatePoint({x:controls.x[i],y: controls.y[i]}, {x: -controls.center[0], y: -controls.center[1]}); // translate in
        controls.x[i] = (t1.x * Math.cos(angle) + (t1.y * -Math.sin(angle)));
        controls.y[i] = (t1.x * Math.sin(angle) + (t1.y* Math.cos(angle)));
        let t2 = translatePoint({x:controls.x[i],y: controls.y[i]}, {x: controls.center[0], y: controls.center[1]});
        controls.x[i] = t2.x;
        controls.y[i] = t2.y;
    }
}
//------------------------------------------------------------------
//
// Translates a curve.
//    type: Cardinal, Bezier
//    controls: appropriate to the curve type
//    distance: { x, y }
//
//------------------------------------------------------------------
function translateCurve(type, controls, distance) {
    controls.center[0] += distance.x;
    controls.center[1] += distance.y;
    for( let i = 0; i < controls.x.length; i++){
        controls.x[i] += distance.x;
        controls.y[i] += distance.y;
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
        drawCurve: drawCurve,
        drawPrimitive: drawPrimitive,
        translatePrimitive: translatePrimitive,
        translatePoint: translatePoint,
        scalePrimitive: scalePrimitive,
        rotatePrimitive: rotatePrimitive,
        translateCurve: translateCurve,
        scaleCurve: scaleCurve,
        rotateCurve: rotateCurve
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
}(2000, 2000, false));
