var canvasWidth = 800;
var canvasHeight = 600;
var canvasMargin = 10;

var redrawCanvasInterval = 50;
var transitionObjectInterval = 5000;
var takeAction = 0;
var takeActionThreshold = transitionObjectInterval / redrawCanvasInterval;

var moveNumber = 0;

var canvas = d3.select("body").append("canvas")
    .attr("id", "main-canvas")
    .attr("height", canvasHeight)
    .attr("width", canvasWidth);

var context = canvas.node().getContext("2d")

var detachedContainer = document.createElement("custom");
var circleContainer = d3.select(detachedContainer);

var userContainer = document.createElement("custom");
var userCircleCont = d3.select(userContainer);

function addNewCircle(){
    var randomX =  (Math.random() * (canvasWidth - canvasMargin*2)) + canvasMargin;
    var randomY =  (Math.random() * (canvasHeight - canvasMargin*2)) + canvasMargin;
    var circleItem = circleContainer.append("circle")
        .attr("class", "circleNode")
        .attr("cx", randomX)
        .attr("cy", randomY)
        .attr("r", 30)
        .attr("fill", randomColor);
}

for(i = 0; i < 20; i++)
{
    addNewCircle();
}

var userItem = circleContainer.append("circle")
    .attr("class", "userCircleNode")
    .attr("id", "userCircle")
    .attr("r", 30)
    .attr("fill", "black");

var circleBinding = circleContainer.selectAll(".circleNode");
var userBinding = circleContainer.selectAll(".userCircleNode");

function drawCanvas(circleBinding, context){
    circleBinding.each(function(d) {
        var node = d3.select(this);
        context.fillStyle = node.attr("fill");
        context.beginPath();
        context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI, true);
        context.fill();
        context.closePath();
    });
    userBinding.each(function(d) {
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
    var userX = [];
    var userY = [];
    var userColor = [];
    var userRadius = [];
    circleBinding.each(function(d) {
        node = d3.select(this);
        currentX.push(Math.round(node.attr("cx")));
        currentY.push(Math.round(node.attr("cy")));
        currentColor.push(node.attr("fill"));
        currentRadius.push(+node.attr("r"));
    });
    userBinding.each(function(d) {
        node = d3.select(this);
        userX.push(Math.round(node.attr("cx")));
        userY.push(Math.round(node.attr("cy")));
        userColor.push(node.attr("fill"));
        userRadius.push(+node.attr("r"));
    })        
    for(i = 0; i < userX.length; i++) {
        for(h = 0; h < currentX.length; h++) {
            if(userX[i] > (currentX[h] - currentRadius[h] - userRadius[i]/2) && userX[i] < (currentX[h] + currentRadius[h] + userRadius[i]/2)){
                if(userY[i] > (currentY[h] - currentRadius[h] - userRadius[i]/2) && userY[i] < (currentY[h] + currentRadius[h] + userRadius[i]/2)){
                    alert('Collision detected at pos: ' + userX[i] + ', ' + userY[i] + ' with circle ' + h + ' at: ' + currentX[h] + ', ' + currentY[h] + ' after ' + moveNumber + ' direction changes.  You lose.');
                    d3timer.stop();
                    return true;
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
        moveNumber = moveNumber + 1;
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

d3.select("#main-canvas")
    .on("touchstart", touchStart)
    .on("touchmove", touchMove)
    .on("touchend", touchEnd);


function touchStart() {
  d3.event.preventDefault();
  var d = d3.touches(this);
  userBinding.each(function() {
    var node = d3.select(this);
    node.attr("cx", +(d[0])[0]);
    node.attr("cy", +(d[0])[1]);
  });
}

function touchMove() {
  d3.event.preventDefault();
  var d = d3.touches(this);
  userBinding.each(function() {
    var node = d3.select(this);
    node.attr("cx", +(d[0])[0]);
    node.attr("cy", +(d[0])[1]);
  });
}

function touchEnd() {
  d3.event.preventDefault();
  alert("You stopped touching me.  You lose");
}