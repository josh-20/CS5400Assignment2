
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
   
    let Cardinal = {
        x: [600,200,601,600],
        y: [500,400,500,550],
        t: [10],
        center: [500,500]    
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
            graphics.translatePrimitive(rS,{x: 1,y: 1})
            if(i >= 50){
                flip = true;
            }
            i += 1 + elapsedTime/1000;
        }else{
            graphics.translatePrimitive(rS,{x: -1,y: -1 })
            i -= 1 - elapsedTime/1000;
            if(i <= 0){
                flip = false;
            }
        }
        graphics.scaleCurve(1,Cardinal, {x:.5 *elapsedTime/1000, y:.5 * elapsedTime/1000});


    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawPrimitive({x: rS.x, y: rS.y, center: rS.center},true, color);
        graphics.drawCurve(1,Cardinal,50,true,true,true,"yellow");
        
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
