
MySample.main = (function(graphics) {
    'use strict';

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    let previousTime = performance.now();
    let TENSION = 0;
    let SEGMENTS = 1;
    let i = 0;
    let flip = false;
    let y = 500;
    let HermiteCoord = {
        cP1: [100,200],
        tP1: [50,400],
        cP2: [300,300],
        tP2: [-200,200]
    }
    let Cardinal = {
        cP1: [500,500],
        tP1: [50,400],
        cP2: [600,550],
        tP2: [-200,200]
    }
    let Bezier = {
        cP1: [100,200],
        tP1: [50,400],
        cP2: [300,300],
        tP2: [-200,200]
    }
    let BEZCoord = {
        cP1: [100,200],
        tP1: [50,400],
        cP2: [300,300],
        tP2: [-200,200]
    }
    function update(elapsedTime) {

        if (!flip){
            if (i >= 100){
                flip = true;
            }
            HermiteCoord.cP1[0] += .5;
            TENSION += 1;
            SEGMENTS += 1;
            i + (elapsedTime/500);
        }
        if (flip){
            if (i <= 0){
                flip = false;
            }
            HermiteCoord.cP1[0] -= .1;
           TENSION -= 1;
            SEGMENTS -= 1;
            i--;
        }


    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawCurve(0, [[HermiteCoord.cP1[0],HermiteCoord.cP1[1]],[HermiteCoord.tP1[0],HermiteCoord.tP1[1]], [HermiteCoord.cP2[0],HermiteCoord.cP2[1]],[HermiteCoord.tP2[0],HermiteCoord.tP2[1]]], SEGMENTS, true,true,true, "blue");
        graphics.drawCurve(1, [[Cardinal.cP1[0],Cardinal.cP1[1]],[Cardinal.tP1[0],Cardinal.tP1[1]], [Cardinal.cP2[0],Cardinal.cP2[1]], [Cardinal.tP2[0],Cardinal.tP2[1]], [TENSION] ], SEGMENTS, true,true,true, "orange");
        graphics.drawCurve(2, [[Bezier.cP1[0],Bezier.cP1[1]],[Bezier.tP1[0],Bezier.tP1[1]], [Bezier.cP2[0],Bezier.cP2[1]], [Bezier.tP2[0],Bezier.tP2[1]]], SEGMENTS, true,true,true, "blue");
        graphics.drawCurve(3, [[BEZCoord.cP1[0],BEZCoord.cP1[1]],[BEZCoord.tP1[0],BEZCoord.tP1[1]], [BEZCoord.cP2[0],BEZCoord.cP2[1]], [BEZCoord.tP2[0],BEZCoord.tP2[1]]], SEGMENTS, true,true,true, "blue");
        
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {
        let elapsedTime = time - previousTime;
        previousTime = time;
        update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
