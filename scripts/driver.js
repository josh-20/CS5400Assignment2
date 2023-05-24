
MySample.main = (function(graphics) {
    'use strict';

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    let previousTime = performance.now();
    let TENSION = 10;
    let SEGMENTS = 1;
    let i = 1;
    let flip = false;
   
    let HermiteCoord = {
        cP1: [700,200],
        tP1: [50,400],
        cP2: [600,300],
        tP2: [-200,200]
    }
    let Cardinal = {
        cP1: [600,500],
        tP1: [200,400],
        cP2: [601,500],
        tP2: [600,550]
    }
    let Bezier = {
        cP1: [600,600],
        tP1: [50,400],
        cP2: [573,800],
        tP2: [-200,200]
    }
    let BEZCoord = {
        cP1: [650,610],
        tP1: [50,400],
        cP2: [550,820],
        tP2: [-200,200]
    }
    function update(elapsedTime) {
        if (!flip){
            if (i >= 10){
                flip = true;
            }
            if(i < 10){
                HermiteCoord.tP1[0] += 1 * (elapsedTime/150);
                HermiteCoord.tP1[1] += 1 * (elapsedTime/150);
                HermiteCoord.cP1[0] += 2 * (elapsedTime/150);
                HermiteCoord.cP1[1] += 1 * (elapsedTime/150);
                HermiteCoord.tP2[0] += 1 * (elapsedTime/150);
                HermiteCoord.tP2[1] += 1 * (elapsedTime/150);
                HermiteCoord.cP2[0] += 5 * (elapsedTime/150);
                HermiteCoord.cP2[1] += 1 * (elapsedTime/150);
                Cardinal.cP1[0] -= 1 * (elapsedTime/150);
                Cardinal.cP1[1] += 1 * (elapsedTime/150);
                Bezier.tP1[0] -= 1 * (elapsedTime/150);
                Bezier.tP1[1] -= 2 * (elapsedTime/150);
                BEZCoord.tP1[0] += 1 * (elapsedTime/150);
                BEZCoord.tP1[1] += 2 * (elapsedTime/150);
            }
            if(SEGMENTS < 50){
                SEGMENTS += 1 * (elapsedTime/150);
            }
            i += (elapsedTime/1000);
        }
        if (flip){
            if (i <= 0){
                flip = false;
            }
            if (i > 0){
                HermiteCoord.tP1[0] -= 1 * (elapsedTime/150);
                HermiteCoord.tP1[1] -= 1 * (elapsedTime/150);
                HermiteCoord.cP1[0] -= 2 * (elapsedTime/150);
                HermiteCoord.cP1[1] -= 1 * (elapsedTime/150);
                HermiteCoord.tP2[0] -= 1 * (elapsedTime/150);
                HermiteCoord.tP2[1] -= 1 * (elapsedTime/150);
                HermiteCoord.cP2[0] -= 5 * (elapsedTime/150);
                HermiteCoord.cP2[1] -= 1 * (elapsedTime/150);
                Cardinal.cP1[0] += 1 * (elapsedTime/150);
                Cardinal.cP1[1] -= 1 * (elapsedTime/150);
                Bezier.tP1[0] += 1 * (elapsedTime/150);
                Bezier.tP1[1] += 2 * (elapsedTime/150);
                BEZCoord.tP1[0] -= 1 * (elapsedTime/150);
                BEZCoord.tP1[1] -= 2 * (elapsedTime/150);
            }
            i -= (elapsedTime/1000);
        }


    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        // graphics.drawCurve(0, [[HermiteCoord.cP1[0],HermiteCoord.cP1[1]],[HermiteCoord.tP1[0],HermiteCoord.tP1[1]], [HermiteCoord.cP2[0],HermiteCoord.cP2[1]],[HermiteCoord.tP2[0],HermiteCoord.tP2[1]]], SEGMENTS, true,true,true, "pink");
        // graphics.drawCurve(1, [[Cardinal.cP1[0],Cardinal.cP1[1]],[Cardinal.tP1[0],Cardinal.tP1[1]], [Cardinal.cP2[0],Cardinal.cP2[1]], [Cardinal.tP2[0],Cardinal.tP2[1]], [TENSION] ], SEGMENTS, true,true,true, "orange");
        // graphics.drawCurve(2, [[Bezier.cP1[0],Bezier.cP1[1]],[Bezier.tP1[0],Bezier.tP1[1]], [Bezier.cP2[0],Bezier.cP2[1]], [Bezier.tP2[0],Bezier.tP2[1]]], SEGMENTS, true,true,true, "blue");
        // graphics.drawCurve(3, [[BEZCoord.cP1[0],BEZCoord.cP1[1]],[BEZCoord.tP1[0],BEZCoord.tP1[1]], [BEZCoord.cP2[0],BEZCoord.cP2[1]], [BEZCoord.tP2[0],BEZCoord.tP2[1]]], SEGMENTS, true,true,true, "blue");
        graphics.drawPrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]},true,"blue");
        graphics.scalePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]},{x: .5, y: .5});
        graphics.rotatePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]}, 25);
        graphics.translatePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]}, {x: 10, y: 10});
        graphics.translateCurve(0,[[HermiteCoord.cP1[0],HermiteCoord.cP1[1]],[HermiteCoord.tP1[0],HermiteCoord.tP1[1]], [HermiteCoord.cP2[0],HermiteCoord.cP2[1]],[HermiteCoord.tP2[0],HermiteCoord.tP2[1]]], .5);
        
        
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {
        let elapsedTime = time - previousTime;
        previousTime = time;
        // update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
