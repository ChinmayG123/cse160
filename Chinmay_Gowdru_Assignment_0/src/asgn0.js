// DrawRectangle.js 

function handleDrawEvent() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');


    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the canvas background to black again
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Read the values from the input boxes for v1 and v2
    var x1 = document.getElementById('x1Coord').value;
    var y1 = document.getElementById('y1Coord').value;
    var x2 = document.getElementById('xCoord2').value;
    var y2 = document.getElementById('yCoord2').value; 

    // Create a Vector3 instance for v1 and v2 with the input values
    var v1 = new Vector3([parseFloat(x1), parseFloat(y1), 0]);
    var v2 = new Vector3([parseFloat(x2), parseFloat(y2), 0]);

    // Call drawVector to draw v1 in red and v2 in blue
    drawVector(v1, 'red');
    drawVector(v2, 'blue'); 

    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color 
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
}


function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');


    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the canvas background to black again
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Read the values from the input boxes for v1 and v2
    var x1 = document.getElementById('x1Coord').value;
    var y1 = document.getElementById('y1Coord').value;
    var x2 = document.getElementById('xCoord2').value;
    var y2 = document.getElementById('yCoord2').value; 

    // Create a Vector3 instance for v1 and v2 with the input values
    var v1 = new Vector3([parseFloat(x1), parseFloat(y1), 0]);
    var v2 = new Vector3([parseFloat(x2), parseFloat(y2), 0]);
    

    // Call drawVector to draw v1 in red and v2 in blue
    drawVector(v1, 'red');
    drawVector(v2, 'blue'); 


    // Perform operation based on selector value
    var operation = document.getElementById('operationSelector').value;
    var scalar = parseFloat(document.getElementById('scalarInput').value);
    var v3, v4;

    if (operation == 'add') {
        v3 = new Vector3([0, 0, 0]).add(v1).add(v2);
        drawVector(v3, 'green');
    }
    else if (operation == 'sub') {
        v3 = new Vector3([0, 0, 0]).add(v1).sub(v2);
        drawVector(v3, 'green');
    }
    else if (operation == 'mul') {
        v3 = new Vector3([0, 0, 0]).add(v1).mul(scalar);
        v4 = new Vector3([0, 0, 0]).add(v2).mul(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    }
    else if (operation == 'div') {
        if (scalar !== 0) {
            v3 = new Vector3([0, 0, 0]).add(v1).div(scalar);
            v4 = new Vector3([0, 0, 0]).add(v2).div(scalar);
            drawVector(v3, 'green');
            drawVector(v4, 'green');
        } else {
            console.log('Scalar value cannot be zero for division.');
        }
    }
    else if (operation == 'angle') {
        angleBetween(v1, v2);
    }
    else if (operation == 'area') {
        var triangleArea = areaTriangle(v1, v2);

        console.log("Area of the triangle:", triangleArea);
    }
    else if (operation == 'norm') {
        v1.normalize();
        v2.normalize();
        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    else if (operation == 'mag') {
        console.log('Magnitude v1:', v1.magnitude());
        console.log('Magnitude v2:', v2.magnitude());
    }

    // switch (operation) {
    //     case 'add':
    //         v3 = new Vector3([0, 0, 0]).add(v1).add(v2);
    //         drawVector(v3, 'green');
    //         break;
    //     case 'sub':
    //         v3 = new Vector3([0, 0, 0]).add(v1).sub(v2);
    //         drawVector(v3, 'green');
    //         break;
    //     case 'mul':
    //         v3 = new Vector3([0, 0, 0]).add(v1).mul(scalar);
    //         v4 = new Vector3([0, 0, 0]).add(v2).mul(scalar);
    //         drawVector(v3, 'green');
    //         drawVector(v4, 'green');
    //         break;
    //     case 'div':
    //         if (scalar !== 0) {
    //             v3 = new Vector3([0, 0, 0]).add(v1).div(scalar);
    //             v4 = new Vector3([0, 0, 0]).add(v2).div(scalar);
    //             drawVector(v3, 'green');
    //             drawVector(v4, 'green');
    //         } else {
    //             console.log('Scalar value cannot be zero for division.');
    //         }
    //         break;
    //     case 'angle':
    //         angleBetween(v1, v2);
    //         break;
    //     case 'area':
    //         // Calculate the area of the triangle
    //         var triangleArea = areaTriangle(v1, v2);

    //         // Print the result to the console
    //         console.log("Area of the triangle:", triangleArea);
    //     case 'norm':
    //         v1.normalize();
    //         v2.normalize();
    //         drawVector(v1, 'green');
    //         drawVector(v2, 'green');
    //         break;
    //     case 'mag':
    //         console.log('Magnitude v1:', v1.magnitude());
    //         console.log('Magnitude v2:', v2.magnitude());
    //         break;
    //     default:
    //         console.log('Invalid operation');
    // }

    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color 
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
}

function areaTriangle(v1, v2) {
    // Compute the cross product of v1 and v2
    var crossProduct = Vector3.cross(v1, v2);

    // Calculate the magnitude of the cross product
    var areaParallelogram = crossProduct.magnitude();

    // The area of the triangle is half the area of the parallelogram
    var areaTriangle = areaParallelogram / 2;

    // Return the area of the triangle
    return areaTriangle;
}

function angleBetween(v1, v2) {
    // Ensure both vectors are instances of Vector3
    if (!(v1 instanceof Vector3) || !(v2 instanceof Vector3)) {
        console.error('Both arguments must be instances of Vector3.');
        return 0;
    }

    // Calculate dot product of v1 and v2
    var dotProduct = Vector3.dot(v1, v2);

    // Calculate magnitudes of v1 and v2
    var magnitudeV1 = v1.magnitude();
    var magnitudeV2 = v2.magnitude();

    // Calculate the cosine of the angle using the dot product formula
    var cosAngle = dotProduct / (magnitudeV1 * magnitudeV2);

    // Calculate the angle in radians and then convert it to degrees
    var angleRadians = Math.acos(cosAngle); // Angle in radians
    var angleDegrees = angleRadians * (180 / Math.PI); // Convert to degrees

    // Log the angle to the console
    console.log(`Angle: ${angleDegrees}`);

    // Return the angle in degrees
    return angleDegrees;
}


// You may want to assign the function to the button's onclick event in main or after the DOM is loaded
function main() {
    // Previous main function content

    var canvas = document.getElementById('example'); 
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element ');
        return false; 
    }
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Assign handleDrawEvent to the draw button's onclick event
    document.getElementById('drawBtn').onclick = handleDrawEvent;
}

// Ensure the main function is called after the DOM has fully loaded
window.onload = main;

function drawVector(v, color) {

    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');


    var scaleFactor = 20;
    var endX = canvas.width / 2 + v.elements[0] * scaleFactor;
    var endY = canvas.height / 2 - v.elements[1] * scaleFactor; 

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2); 
    ctx.lineTo(endX, endY); 
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

}