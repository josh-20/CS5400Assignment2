
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
    
    
   
    let Cardinal = {
        x: [250,750,750,250],
        y: [250,250,750,750],
        t: [10],
        center: [500,500]    
    }
    let Bezier = {
        x: [250,750,750,250],
        y: [250,250,750,750],
        center: [500,500]
    }
    let BEZCoord = {
        x: [750,250,250,750],
        y: [250,250,750,750],
        center:[500,500]
    }
    let rS = {
        x: [250,750,750,250],
        y:[250,250,750,750],
        center: [500,500]
    }
    let cBox1 = {
        x: [750,850,850,750],
        y:[250,250,150,150],
        center: [500,500]
    }
    let cBox2 = {
        x: [250,250,150,150],
        y:[750,850,850,750],
        center: [500,500]
    }
    let colors = ["blue","green","yellow","white","orange","brown","red","pink"]
    let color = "black";
    let colorCount = 0;

    function update(elapsedTime) {
        if(!flip){
            if (i >= 500){
                flip = true;
                
                        color = colors[colorCount];
                        colorCount += 1;
                    }
                    graphics.scaleCurve(1,Cardinal,{x:  (1 + elapsedTime/10000),y: 1 + elapsedTime/10000});
                    graphics.scalePrimitive(rS,{x:  (1 + elapsedTime/10000),y: 1 + elapsedTime/10000});
                    graphics.scalePrimitive(cBox1,{x: (1 + elapsedTime/10000),y: 1 + elapsedTime/10000});
                    graphics.scalePrimitive(cBox2,{x: (1 + elapsedTime/10000),y: 1 + elapsedTime/10000});
                    graphics.translateCurve(2,Bezier,{x:.5,y:1});
                    graphics.translateCurve(3,BEZCoord,{x:-.5,y:-1});
                    graphics.rotateCurve(3,BEZCoord, elapsedTime/10000);
                    graphics.translatePrimitive(cBox1,{x:.5,y:1})
                    graphics.translatePrimitive(cBox2,{x:.5,y:1})
                    i += (1 + elapsedTime/1000);
                    
                }else{
                    if(i <= 0)
                    {
                        flip = false;
                        color = colors[colorCount];
                        colorCount += 1;
                    }
                    graphics.rotateCurve(2,Bezier, elapsedTime/10000);
                    graphics.scalePrimitive(rS,{x:  (1 - elapsedTime/10000),y: 1 - elapsedTime/10000});
                    graphics.scalePrimitive(cBox1,{x: (1 - elapsedTime/10000),y: 1 - elapsedTime/10000})
                    graphics.scalePrimitive(cBox2,{x: (1 - elapsedTime/10000),y: 1 - elapsedTime/10000})
                    graphics.scaleCurve(1,Cardinal,{x:  (1 - elapsedTime/10000),y: 1 - elapsedTime/10000});
                    graphics.translateCurve(2,Bezier,{x:-.5,y:-1});
                    graphics.translateCurve(3,BEZCoord,{x:.5,y:1});
                    graphics.translatePrimitive(cBox1,{x:-.5,y:-1})
                    graphics.translatePrimitive(cBox2,{x:-.5,y:-1})
            i -= (1 + elapsedTime/1000);
        }
        if(colorCount == colors.length -1){
            colorCount = 0;
        }
        graphics.rotatePrimitive(rS, elapsedTime/10000);
        graphics.rotateCurve(1,Cardinal, elapsedTime/10000);
        graphics.rotateCurve(2,Bezier, elapsedTime/10000);
        graphics.rotateCurve(3,BEZCoord, elapsedTime/10000);
        graphics.rotatePrimitive(cBox1,elapsedTime/10000);
        graphics.rotatePrimitive(cBox2,elapsedTime/10000);

        

        // graphics.translateCurve(1,Cardinal,{x:10*elapsedTime/1000,y:10 * elapsedTime/1000});
        
        
    }
    
    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawPrimitive(rS,true, color);
        graphics.drawCurve(3,BEZCoord,50,true,true,false,"yellow");
        graphics.drawCurve(2,Bezier,50,true,true,false,"orange")
        graphics.drawCurve(1,Cardinal,50,true,true,false,"blue");
        graphics.drawPrimitive(cBox1,true,color);
        graphics.drawPrimitive(cBox2,true, color);
        
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
