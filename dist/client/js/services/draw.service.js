var app = angular.module('starter');

app.factory('Draw', function($rootScope, $q, DeferredWithUpdate, $timeout, $window) {

    var canvas;
    var canvasInfo;

    // Animation values
    var scaleRatio = 0.995;
    var spiralCenter = 0.31;
    var spiralVariance = 0.225;

    // Group for combined drawing = rasterized part
    var group;
    // Group for part during drawing (always has only the paths of one part) = array of paths
    var drawingGroup;

    // PaperJS path variable to be filled up with the generated points
    var path;
    var startingPoint;

    // Object for the cross lines & parameters
    var crossLines = {
        top: {
            path: {},
            y: 0,
            active: true
        },
        bottom: {
            path: {},
            y: 0,
            active: true
        },
        x1: 0,
        x2: 0,
        verticalPadding: 0,
        hasCrossed: [],
        toggle: function(select, toggle) {
            this[select].active = toggle;
            this[select].path.visible = toggle;
            paper.project.view.update();
        },
        resetHits: function() {
            _.fill(this.hasCrossed, 0);
        },
    };
    var crossLinePromise = DeferredWithUpdate.defer();

    // Flag used to determine when the mouse is pressed
    var drag = false;

    // Draw modes
    var drawToggle = false;
    var resetMode = '';
    var drawMode = 'lineMedium';
    var strokeColor = '#8c00ff';
    var strokeWidth = 10;

    // Flags for final drawing
    var finalHeight = 0;
    var rotation = 0;


    var service = {

        // Helper to get correct touch position on all devices
        cursorPos: function(event) {

            var x = event.offsetX || event.layerX || event.touches[0].pageX;
            var y = event.offsetY || event.layerY || event.touches[0].pageY;

            return {
                x: x,
                y: y
            };
        },

        // Init method
        initPaper: function(canvas, info) {

            canvasInfo = info;

            // Register PaperJS in global scope
            paper.install(window);

            // Register PaperJS on the canvas
            canvas = canvas;
            paper.setup(canvas); // $element[0] is the <canvas>

            group = new Group();
            drawingGroup = new Group();
            // crossLines = new Group();

            // Init crossline points
            service.initCrosslineDimensions();
            // Draw cross lines
            service.drawCrosslines();

        },

        initCrosslineDimensions: function() {

            // Add padding left & right
            crossLines.x1 = $window.innerWidth * 0.15;
            crossLines.x2 = $window.innerWidth - crossLines.x1;

            crossLines.verticalPadding = $window.innerHeight * 0.1; // Add padding from bottom
            crossLines.top.y = crossLines.verticalPadding;
            crossLines.bottom.y = $window.innerHeight - crossLines.verticalPadding;

        },

        drawCrosslines: function() {

            // Create path
            crossLines.bottom.path = new paper.Path();

            // Set style
            crossLines.bottom.path.strokeColor = '#808080';
            crossLines.bottom.path.strokeWidth = 3;
            crossLines.bottom.path.strokeCap = 'round';
            crossLines.bottom.path.dashArray = [10, 12];

            // Add points
            crossLines.bottom.path.add(new paper.Point(crossLines.x1, crossLines.bottom.y));
            crossLines.bottom.path.add(new paper.Point(crossLines.x2, crossLines.bottom.y));

            // Add top cross line
            crossLines.top.path = crossLines.bottom.path.clone();
            crossLines.top.path.position.y = crossLines.top.y;

            // Update view
            paper.project.view.update();

            // Hit counters
            crossLines.hasCrossed = [];
            crossLines.hasCrossed.push(0);
            crossLines.hasCrossed.push(0);

        },

        toggleCrossLine: function(select, toggle) {
            crossLines.toggle(select, toggle);
        },

        mouseDown: function(event) {

            if (!drawToggle) {
                return;
            }

            // Set flag to detect mouse drag
            drag = true;

            // Start a new path to be filled by the now active drag movements
            path = new paper.Path();
            path.strokeColor = strokeColor;
            path.strokeWidth = strokeWidth;
            path.strokeCap = 'round';

            // Abstract mouse/touch & ios/android positions
            startingPoint = service.cursorPos(event);

            // Add 1st point to path
            path.add(new paper.Point(startingPoint.x, startingPoint.y));

            // Start animation?
            if (drawMode.indexOf('line') < 0) {
                paper.project.view.onFrame = service.onFrame;
            }

        },

        mouseDrag: function(event) {

            if (drag) {

                // Don't add points in these modes
                switch (drawMode) {
                    case 'spiral':
                        return;

                }

                // Abstract mouse/touch & ios/android positions
                var pos = service.cursorPos(event);

                // Add point to path
                path.add(new paper.Point(pos.x, pos.y));

                // Check if hit line has been crossed
                crossLines.top.active && service.hasHitCrossline(path, crossLines.top.path, 0);
                crossLines.bottom.active && service.hasHitCrossline(path, crossLines.bottom.path, 1);

            }
        },

        mouseUp: function(event) {

            // Stop animation
            service.stopAnimation();

            // Clear mouse Drag Flag
            drag = false;

            // Zeichnung ausdünnen
            switch (drawMode) {
                case 'spiral':
                    break;

                default:
                    path.smooth();
                    path.simplify();
                    break;

            }

            // Add path to group
            drawingGroup.addChild(path);

            // Reset flag for indicating if a path has crossed the line
            crossLines.resetHits();

        },

        hasHitCrossline: function(path1, path2, index) {

            // Get intersections
            var intersections = path1.getIntersections(path2);

            // Draw little circles
            for (var i = 0; i < intersections.length; i++) {
                drawingGroup.addChild(new paper.Path.Circle({
                    center: intersections[i].point,
                    radius: 7,
                    fillColor: '#2196f3'
                }));
            }

            // Dispatch event if the path has crossed the hit line
            if (intersections.length > crossLines.hasCrossed[index]) {

                crossLines.hasCrossed[index] += 1;

                crossLinePromise.resolve({
                    index: index
                });

            }

        },

        crossLineHit: function() {
            return crossLinePromise.promise;
        },

        // Method to animate paths & groups
        // Source: http://paperjs.org/tutorials/getting-started/using-javascript-directly/
        onFrame: function(event) {

            var speed = 20;

            // Select animation type
            switch (drawMode) {
                case 'spiral':

                    // Add point to path
                    var max = spiralCenter + spiralVariance;
                    var min = spiralCenter - spiralVariance;
                    var diff = 0.0 + Math.floor(Math.random() * (max - min + 1) + min);
                    startingPoint.y += diff;
                    path.add(new paper.Point(startingPoint.x, startingPoint.y));
                    path.translate(new Point(-diff, -diff));

                    // Rotate the path
                    path && path.rotate(8 + diff);
                    break;

                case 'next':

                    // Disable animation
                    service.stopAnimation();

                    group && group.translate(new Point(0, -$window.innerHeight + 2 * crossLines.verticalPadding));

                    // // Draw next cross line at the bottom
                    // needsCrossline && service.drawCrosslines();

                    // Reset stuff
                    drawMode = resetMode;

                    break;

                case 'done':

                    group.position = paper.project.view.center; //new Point(0, 0); 

                    // Scale down drawing
                    if (finalHeight >= $window.innerWidth - crossLines.verticalPadding) {
                        group.scale(scaleRatio);
                        finalHeight = finalHeight * scaleRatio;
                    }

                    rotation += 15;
                    if (rotation === 360) rotation = 0;
                    group.rotate(15);

                    // If the drawing fully fits into the screen stop the animation
                    if (finalHeight <= $window.innerWidth - crossLines.verticalPadding && rotation === 270) {

                        // Disable animation
                        service.stopAnimation();

                    }
                    break;


                case 'clear':

                    // Scale down drawing
                    if (finalHeight >= 0) {
                        group.scale(scaleRatio * 0.94);
                        finalHeight = finalHeight * 0.94;
                    }

                    group.rotate(20);

                    // If the drawing fully fits into the screen stop the animation
                    if (finalHeight === 0) {

                        // Disable animation
                        service.stopAnimation();

                    }
                    break;

                default:
                    break;

            }

        },

        exportData: function() {

            var d = $q.defer();

            $timeout(function() {
                // ToDo: EXPORT paths for later!
                var partData = drawingGroup.exportJSON({
                    asString: false
                });

                var ret = {
                    data: partData,
                    crossLines: []
                };

                crossLines.top.active && ret.crossLines.push(crossLines.top.path);
                crossLines.bottom.active && ret.crossLines.push(crossLines.bottom.path);

                // Send event to controller
                d.resolve(ret);
            });

            return d.promise;

        },

        rasterizePart: function() {

            // Add rasterized version of the part to the whole drawing
            group.addChild(drawingGroup.rasterize());

            // Calculate stroke widths, scale factor, ...
            finalHeight = group.strokeBounds.height;

            // Pfade entfernen
            drawingGroup.remove();
            drawingGroup = new Group();

            return service;

        },

        // clearCanvas: function () {

        //     var context = $element[0].getContext("2d");
        //     context.clearRect(0, 0, $element[0].width, $element[0].height);

        // },


        // Going to next part
        nextPart: function(config) {

            // Move group up to only show the last bits of it
            resetMode = drawMode;
            drawMode = 'next';
            if (!config.movePartsUp) {
                drawMode = 'done';

                // Remove crosslines
                crossLines.toggle('top', false);
                crossLines.toggle('bottom', false);
            }

            return service;

        },

        // Going to next part
        spinOut: function() {

            // Move group up to only show the last bits of it
            resetMode = drawMode;
            drawMode = 'clear';

            // Start animation
            paper.project.view.onFrame = service.onFrame;

            return service;

        },

        startAnimation: function() {
            paper.project.view.onFrame = service.onFrame;
        },
        stopAnimation: function() {
            paper.project.view.onFrame = null;
        },

        // Going to next part
        undo: function() {

            if (drawingGroup.children.length === 0) return;

            drawingGroup.removeChildren(drawingGroup.children.length - 1);
            paper.project.view.update();

        },

        // Listen for event from controller
        toggleDrawing: function(toggle) {
            // Set draw toggle
            drawToggle = toggle;
        },

        setColor: function(color) {
            strokeColor = color;
        },
        getColor: function() {
            return strokeColor;
        },

        // Listen for event from controller
        setMode: function(mode) {

            // Move group up to only show the last bits of it
            drawMode = mode;

            // Select animation type
            switch (mode) {
                case 'lineSmall':
                    strokeWidth = 4;
                    break;

                case 'lineMedium':
                    strokeWidth = 10;
                    break;

                case 'lineBig':
                    strokeWidth = 40;
                    break;

                case 'spiral':
                    strokeWidth = 7;
                    break;

            }

        },
        getMode: function() {
            return drawMode;
        },

        moveUp: function() {
            group && group.translate(new Point(0, -$window.innerHeight + 2 * crossLines.verticalPadding));
        },

        // Load a drawing part from JSON and render it
        loadPart: function(part) {

            // Load paper group with paths
            drawingGroup = new paper.Group();
            drawingGroup.importJSON(JSON.stringify(part.paperjs));

            // Import crosslines (for helping the scaling & positioning)
            var deviceDiffCl = null;
            var bottomCl = new Path();
            if (part.crossLines.length === 2) {
                bottomCl.importJSON(JSON.stringify(part.crossLines[1]));
                deviceDiffCl = new Path();
                deviceDiffCl.importJSON(JSON.stringify(part.crossLines[0]));
            } else {
                bottomCl.importJSON(JSON.stringify(part.crossLines[0]));
            }
            // Helper group for scaling
            var scaleGroup = new Group();
            scaleGroup.addChild(drawingGroup);
            scaleGroup.addChild(bottomCl);
            scaleGroup.pivot = scaleGroup.bounds.center;
            scaleGroup.position = paper.project.view.center;

            // Scale to source canvas size
            var ratio = canvasInfo.width / part.canvas.width / (canvasInfo.devicePixelRatio / part.canvas.devicePixelRatio);
            scaleGroup.scale(ratio);

            // Move to the bottom cross line
            var diffY = crossLines.bottom.y - bottomCl.bounds.y;
            drawingGroup.translate(new paper.Point(0, diffY));

            // Remove helper cross lines
            bottomCl.remove();

            // Part rastern
            service
                .rasterizePart();

            // Move whole group up by device bttom crossline difference
            if (deviceDiffCl) {
                diffY = crossLines.top.y - deviceDiffCl.position.y;
                group && group.translate(new paper.Point(0, diffY));
                deviceDiffCl.remove();
            }

            paper.project.view.update();

            return service;
        }

    };

    return service;

});
