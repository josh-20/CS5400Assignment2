
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
    let RotationAngle = 0;
   
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
    let rS = {
        x: [250,750,750,250],
        y:[250,250,750,750],
        center: [500,500]
    }
    let colors = ["blue","green","yellow","white","orange","brown","red","pink"]
    let color = "black";

    function update(elapsedTime) {
        graphics.rotatePrimitive(rS, elapsedTime/1000);
        if (!flip){
            graphics.translatePrimitive(rS,{x: 10,y: 10})
            if(i >= 50){
                flip = true;
            }
            i += elapsedTime/1000;
        }else{

            graphics.translatePrimitive(rS,{x: -10,y: -10})
            i -= elapsedTime/1000;
            if(i <= 0){
                flip = false;
            }
        }


    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawPrimitive({x: rS.x, y: rS.y, center: rS.center},true, color);
        // graphics.scalePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]},{x: .5, y: .5});
        // graphics.rotatePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]}, RotationAngle);
        // graphics.translatePrimitive({x:[250,750,750,250], y:[250,250,750,750], center: [500,500]}, {x: 10, y: 10});
        // graphics.translateCurve(0,[[HermiteCoord.cP1[0],HermiteCoord.cP1[1]],[HermiteCoord.tP1[0],HermiteCoord.tP1[1]], [HermiteCoord.cP2[0],HermiteCoord.cP2[1]],[HermiteCoord.tP2[0],HermiteCoord.tP2[1]]], .5);
        
        
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
