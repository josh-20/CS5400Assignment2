
MySample.main = (function(graphics) {
    'use strict';

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update() {
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        // graphics.drawCurve(0, [[250,500],[200,500], [500,500], [-200,200]], 10, true,true,true, "blue");
        // graphics.drawCurve(1, [[250,500],[200,400], [500,500], [600,550], [25] ], 50, true,true,true, "orange");
        // graphics.drawCurve(2, [[250,500],[200,400], [500,500], [600,550]], 10, true,true,true, "blue");
        // graphics.drawCurve(3, [[250,500],[200,400], [500,500], [600,550]], 10, true,true,true, "blue");
        graphics.drawCurve(graphics.Curve.BezierMatrix, [[200,400],[400,700],[600,200],[800,400]], 50, true,true,true, "rgb(0, 0, 255)");
        
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        update();
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
