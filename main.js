var canvasWidth = 800;
var canvasHeight = 600;
var canvasMargin = 10;

var redrawCanvasInterval = 50;
var transitionObjectInterval = 5000;
var takeAction = 0;
var takeActionThreshold = transitionObjectInterval / redrawCanvasInterval;

var canvas = d3.select("body").append("canvas")
    .attr("id", "main-canvas")
    .attr("height", canvasHeight)
    .attr("width", canvasWidth);

var context = canvas.node().getContext("2d")

var detachedContainer = document.createElement("custom");
var circleContainer = d3.select(detachedContainer);

for(i = 0; i < 4; i++)
{
    var randomX =  (Math.random() * (canvasWidth - canvasMargin*2)) + canvasMargin;
    var randomY =  (Math.random() * (canvasHeight - canvasMargin*2)) + canvasMargin;
    var circleItem = circleContainer.append("circle")
        .attr("class", "circleNode")
        .attr("id", 'circle_' + i)
        .attr("cx", randomX)
        .attr("cy", randomY)
        .attr("r", 10)
        .attr("fill", randomColor);
}


var circleBinding = circleContainer.selectAll(".circleNode");

function drawCanvas(circleBinding, context){
    circleBinding.each(function(d) {
        var node = d3.select(this);
        context.fillStyle = node.attr("fill");
        context.beginPath();
        context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI, true);
        context.fill();
        context.closePath();
    });
}

function clearCanvas(context){
    context.beginPath();
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function detectCollision(d3timer){
    var currentX = [];
    var currentY = [];
    var currentColor = [];
    var currentRadius = [];
    circleBinding.each(function(d) {
        node = d3.select(this);
        currentX.push(Math.round(node.attr("cx")));
        currentY.push(Math.round(node.attr("cy")));
        currentColor.push(node.attr("fill"));
        currentRadius.push(+node.attr("r"));
    });        
    for(i = 0; i < currentX.length; i++) {
        for(h = 0; h < currentX.length; h++) {
            if(currentX[i] !== 0) {
                if(i !== h){
                    if(currentX[i] > (currentX[h] - currentRadius[h]) && currentX[i] < (currentX[h] + currentRadius[h])){
                        if(currentY[i] > (currentY[h] - currentRadius[h]) && currentY[i] < (currentY[h] + currentRadius[h]) ){
                            alert('Collision detected between circle ' + i + ' at pos: ' + currentX[i] + ', ' + currentY[i] + ' and circle ' + h + ' at: ' + currentX[h] + ', ' + currentY[h]);
                            d3timer.stop();
                            return true;
                        }
                    }
                }
            }
        }
    }
}

function setTransition(){
    if(takeAction == takeActionThreshold) {
        circleBinding.each(function(d) {
            var node = d3.select(this);
            var randomX =  (Math.random() * (canvasWidth - canvasMargin*2)) + canvasMargin;
            var randomY =  (Math.random() * (canvasHeight - canvasMargin*2)) + canvasMargin;
            node.transition()
            .duration(transitionObjectInterval)
            .ease("linear")
            .attr("cx", randomX)
            .attr("cy", randomY)
            .attr("fill", randomColor);
        });
        takeAction = 0;
    }
    else{
        takeAction = takeAction + 1;
    }
}

var d3timer = d3.timer(function(elapsed) {
    clearCanvas(context)

    setTransition();
    detectCollision(d3timer);

    drawCanvas(circleBinding, context);
}, redrawCanvasInterval);