// Chris Waltrip 07-15-2015 Initial file created

// Variable for current brush color
var color = $(".selected").css("background-color");

// Variable for current brush size
var size = 10;

function Paintbrush(ctx) {
    var tool = this;
    var context = ctx;
    this.isDrawing = false;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    var memCanvas = document.createElement('canvas');
    memCanvas.width = 800;
    memCanvas.height = 600;
    var memCtx = memCanvas.getContext('2d');
    this.points = [];

    this.mousedown = function(e) {
        tool.points.push({
            x: e._x,
            y: e._y
        });
        tool.isDrawing = true;
    };

    this.mousemove = function(e) {
        context.strokeStyle = color;
        context.lineWidth = size;
        if (tool.isDrawing) {
            context.clearRect(0, 0, 800, 600);
            context.drawImage(memCanvas, 0, 0);
            tool.points.push({
                x: e._x,
                y: e._y
            });
            brushDraw(context, tool.points);
        }
    };

    this.mouseup = function(e) {
        if (tool.isDrawing) {
            tool.isDrawing = false;
            memCtx.clearRect(0, 0, 800, 600);
            memCtx.drawImage(canvas, 0, 0);
            tool.points = [];
        }
    };

    this.clear = function() {
        context.clearRect(0, 0, 800, 600);
        memCtx.clearRect(0, 0, 800, 600);
    };
}

function brushMoved(e) {
    if (false) {
        e._x = e.touches[0].clientX + this.offsetLeft;
        e._y = e.touches[0].clientY + this.offsetTop;
    }
    else if (e.offsetX || e.offsetX == 0) {
        e._x = e.offsetX;
        e._y = e.offsetY;
    }
    var func = brush[e.type];
    if (func) {
        func(e);
    }
}

function brushDraw(context, points) {
    if (points.length < 6) {
        return;
    }
    if (points.length < 6) {
        var a = points[0];
        context.beginPath();
        context.arc(a.x, a.y, context.lineWidth / 2, 0, Math.PI * 2, !0);
        context.closePath();
        context.fill();
        return;
    }
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2;
        var d = (points[i].y + points[i + 1].y) / 2;
        context.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    context.stroke();
}

function changeColor() {
    var r = $("#red").val();
    var g = $("#green").val();
    var b = $("#blue").val();
    $("#newColor").css("background-color", "rgb(" + r + "," + g + "," + b + ")");
}

function changeSize() {
    var width = $("#size").val();
    $("#newSize").css("width", width).css("height", width).css("border-radius", (width/2)).css("-moz-border-radius", (width/2)).css("-webkit-border-radius", (width/2));
    size = $("#size").val();
}

$(".controls").on("click", "li", function(){
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected");
    color = $(this).css("background-color");
});

$("#showColorSelector").click(function(){
    changeColor();
    $("#colorSelector").toggle();
});

$("#showSizeSelector").click(function(){
    changeSize();
    $("#sizeSelector").toggle();
});

$("#colorSelector input[type=range]").change(changeColor);
$("#sizeSelector input[type=range]").change(changeSize);

$("#addNewColor").click(function(){
    var $newColor = $("<li></li>");
    $newColor.css("background-color", $("#newColor").css("background-color"));
    $(".controls ul").append($newColor);
    $newColor.click();
});

var timeoutID = window.setTimeout(function() {
    var canvas = document.getElementById('canvas');
    var clearButton = document.getElementById('clearCanvasButton');
    brush = new Paintbrush(canvas.getContext('2d'));
    canvas.addEventListener('mousedown', brushMoved, false);
    canvas.addEventListener('mousemove', brushMoved, false);
    canvas.addEventListener('mouseup', brushMoved, false);
    clearButton.addEventListener('click', brush.clear, false);
}, 500);