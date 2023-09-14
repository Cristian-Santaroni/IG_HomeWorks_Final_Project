"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix, nMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var buffer2;
var buffer3;
var copyFrame;
var texSize =512;
var texSize1 =256;
var projectionMatrixLoc;
var ButtonMotion = false;
var catColor = vec4(0.7,0.7,0.7,1.0);
var normalsArray = [];
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0); 
var near = 0.1;
var far = 100.0;
var  fovy = 120.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var normal = vec4(0.0, 1.0, 0.0, 0.0);
var tangent = vec3(1.0, 0.0, 0.0);
var radius = 20.0;
var theta1 = 0.0;
var phi = 0.0;

var lightPosition = vec4(3.0, 50.0, -30.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(0.7, 0.7, 0.7, 1.0);

// --- Motion Blur ---
var framebuffer;
var depthBuffer, programMB;
var motionBlurFlag = false;


var mbPositions = [
  vec2(-1, -1),
  vec2(-1, 1),
  vec2(1, 1),
  vec2(1, 1),
  vec2(1, -1),
  vec2(-1, -1)
];
var mbTextCoords = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 1),
  vec2(1, 0),
  vec2(0, 0)
];

var texture5;

var vBuffer, nBuffer, cBuffer, tBuffer;
var colorLoc, positionLoc, normalLoc, texCoordLoc;
var TextureForBlurring = [];
var frameBuffer;
var ArrayVertices;


var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var colorsArray = [];
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

modelViewMatrix = mat4();


var torsoId = 0;
var torsoIdX= 14;
var torsoIdZ =15
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperFrontLegId = 2;
var leftLowerFrontLegId = 3;
var rightUpperFrontLegId = 4;
var rightLowerFrontLegId = 5;
var leftUpperBackLegId = 6;
var leftUpperBackLegIdY = 16;
var leftUpperBackLegIdZ = 17;
var leftLowerBackLegId = 7;
var rightUpperBackLegId = 8;
var rightLowerBackLegId = 9;
var tailFirstId= 11;
var tailSecondId = 12;
var tailThirdId = 13; 




var torsoHeight = 1.5;
var torsoWidth = 2.0;
var torsoDepth = 4.0;
var UpperFrontLegHeight = 1.5;
var lowerFrontLegHeight = 1.0;
var UpperFrontLegWidth  = 0.5;
var LowerFrontLegWidth  = 0.3;
var UpperBackLegWidth  = 0.5;
var LowerBackLegWidth  = 0.3;
var LowerBackLegHeight = 1.0;
var UpperBackLegHeight = 1.5;
var headHeight = 1.0;
var headWidth = 1.0;
var tailWidth= 0.5;
var tailHeight = 0.5;
var tailDepth  = 1.0;
var numNodes = 18;
var numAngles = 11;
var theta = [80, 0, 220, -10, 160, -10, 220, -10, 160, -10, 0, -20, 0, 20, 0,0,0,0];

///////////
//TABLE
///////////
var NodesTable  = 5;
var heightPlane =  1.0;
var widthPlane  = 9.0;
var depthPlane = 20.0;
var heightLeg = 5.0;
var widthLeg = 1.0;

var planeId  = 0;
var leftFrontLegId = 1;
var rightFrontLegId = 2;
var leftBackLegId = 3;
var rightBackLegId = 4;
var jointTable = [90,180,180,180,180];
////////////////////////


///////////////////////////
//ABOUT TEXTURE 
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


//////////////////////////
var numVertices = 24;

var stack = [];

var figure = [];
var figure2 = [];

var CatPositionX = -15.0;
var TablePositionX = 8.0;
var CatPositionY = -1.0;
for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

for( var i=0; i<NodesTable; i++) figure2[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var positionsArray = [];

init();

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:
    case torsoIdX:
    case torsoIdZ: 
    m = translate(CatPositionX,CatPositionY,0.0);
    //m = rotate(theta[torsoId], vec3(0, 1, 0) );
    m = mult(m,rotate(theta[torsoId], vec3(0, 1, 0) ));
    m = mult(m,rotate(theta[torsoIdX], vec3(1, 0, 0) ));
    m = mult(m,rotate(theta[torsoIdZ], vec3(0, 0, 1) ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m = translate(0.0, torsoHeight+0.2*headHeight, -torsoWidth*1.0);
	  m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
	  m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperFrontLegId, null);
    break;


    case leftUpperFrontLegId:

    m = translate(-(torsoWidth+UpperFrontLegWidth)*0.3, 0.1*UpperBackLegHeight, -torsoWidth*0.8);
	  m = mult(m, rotate(theta[leftUpperFrontLegId], vec3(1, 0, 0)));
    figure[leftUpperFrontLegId] = createNode( m, leftUpperArm, rightUpperFrontLegId, leftLowerFrontLegId );
    break;

    case rightUpperFrontLegId:

    m = translate((torsoWidth+UpperFrontLegWidth)*0.3, 0.1*UpperBackLegHeight, -torsoWidth*0.8);
	  m = mult(m, rotate(theta[rightUpperFrontLegId], vec3(1, 0, 0)));
    figure[rightUpperFrontLegId] = createNode( m, rightUpperArm, leftUpperBackLegId, rightLowerFrontLegId );
    break;

    case leftUpperBackLegId:
    case leftUpperBackLegIdY:
    case leftUpperBackLegIdZ:
    m = translate(-(torsoWidth+UpperBackLegWidth)*0.3, 0.1*UpperBackLegHeight, torsoWidth*0.8);
	  m = mult(m , rotate(theta[leftUpperBackLegId], vec3(1, 0, 0)));
      m = mult(m , rotate(theta[leftUpperBackLegIdY], vec3(0, 1, 0)));
      m = mult(m , rotate(theta[leftUpperBackLegIdZ], vec3(0, 0, 1)));
    figure[leftUpperBackLegId] = createNode( m, leftUpperLeg, rightUpperBackLegId, leftLowerBackLegId );
    break;

    case rightUpperBackLegId:

    m = translate((torsoWidth+UpperBackLegWidth)*0.3, 0.1*UpperBackLegHeight, torsoWidth*0.8);
	  m = mult(m, rotate(theta[rightUpperBackLegId], vec3(1, 0, 0)));
    figure[rightUpperBackLegId] = createNode( m, rightUpperLeg, tailFirstId, rightLowerBackLegId ); // da aggiungere la prima coda
    break;

    case leftLowerFrontLegId:

    m = translate(0.0, UpperFrontLegHeight-0.3, 0.0);
    m = mult(m, rotate(theta[leftLowerFrontLegId], vec3(1, 0, 0)));
    figure[leftLowerFrontLegId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerFrontLegId:

    m = translate(0.0, UpperFrontLegHeight-0.3, 0.0);
    m = mult(m, rotate(theta[rightLowerFrontLegId], vec3(1, 0, 0)));
    figure[rightLowerFrontLegId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerBackLegId:

    m = translate(0.0, UpperBackLegHeight-0.3, 0.0);
    m = mult(m, rotate(theta[leftLowerBackLegId],vec3(1, 0, 0)));
    figure[leftLowerBackLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerBackLegId:

    m = translate(0.0, UpperBackLegHeight-0.3, 0.0);
    m = mult(m, rotate(theta[rightLowerBackLegId], vec3(1, 0, 0)));
    figure[rightLowerBackLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    case tailFirstId:
        m = translate(-(torsoWidth+UpperBackLegWidth)*0.05, 0.2*UpperBackLegHeight, torsoWidth*1.2);
        m = mult(m, rotate(theta[tailFirstId], vec3(1, 0, 0)));
    figure[tailFirstId] = createNode(m, tailFirst, null, tailSecondId);
    break;

    case tailSecondId:
        m = translate(-(torsoWidth+UpperBackLegWidth)*0.01, 0.001*UpperBackLegHeight, 0.8);
        m = mult(m, rotate(theta[tailSecondId], vec3(1, 0, 0)));
    figure[tailSecondId] = createNode(m, tailSecond, null, tailThirdId);
break;
    case tailThirdId:
        m = translate(-(torsoWidth+UpperBackLegWidth)*0.01, 0.07*UpperBackLegHeight, 1.0);
        m = mult(m, rotate(theta[tailThirdId], vec3(1, 0, 0)));
    figure[tailThirdId] = createNode(m, tailThird, null, null);
    break;
    }

}

function initTable(Id) {
    var m = mat4();

    switch(Id) {

        case planeId:
        m = translate(TablePositionX, 2.0, 0.0);
        //m = rotate(theta[torsoId], vec3(0, 1, 0) );
        m = mult(m,rotate(jointTable[planeId], vec3(0, 1, 0) ));
        figure2[planeId] = createNode( m, plane, null , leftFrontLegId);
        break;
    

        case leftFrontLegId:
            m = translate((widthPlane+widthLeg)*0.3, -0.3*heightLeg, widthPlane);
            m = mult(m, rotate(jointTable[leftFrontLegId], vec3(1, 0, 0)));
        figure2[leftFrontLegId] = createNode( m, leftFrontLeg, rightFrontLegId, null);
        break;

        case rightFrontLegId:
            m = translate((widthPlane+widthLeg)*0.3, -0.3*heightLeg, -widthPlane*1);
            m = mult(m, rotate(jointTable[rightFrontLegId], vec3(1, 0, 0)));
        figure2[rightFrontLegId] = createNode( m, rightFrontLeg, leftBackLegId, null);
        break;

        case leftBackLegId:
            m = translate(-(widthPlane+widthLeg)*0.3, -0.3*heightLeg, widthPlane);
            m = mult(m, rotate(jointTable[leftBackLegId], vec3(1, 0, 0)));
        figure2[leftBackLegId] = createNode( m, leftBackLeg, rightBackLegId, null);
        break;

        case rightBackLegId:
            m = translate(-(widthPlane+widthLeg)*0.3, -0.3*heightLeg, -widthPlane*1);
            m = mult(m, rotate(jointTable[rightBackLegId], vec3(1, 0, 0)));
        figure2[rightBackLegId] = createNode( m, rightBackLeg, null, null);
        break;
    }
    
}



function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse1(Id) {

    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure2[Id].transform);
    figure2[Id].render();
    if(figure2[Id].child != null) traverse1(figure2[Id].child);
     modelViewMatrix = stack.pop();
    if(figure2[Id].sibling != null) traverse1(figure2[Id].sibling);
 }


function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    for(var i=0; i<6; i++) 
    {
        
        
        if(i == 4.0)
        {
            
            gl.uniform1f( gl.getUniformLocation(program, "useTexture"), 2.0 ); 
            
        }
       else {
            
            gl.uniform1f( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
        }
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UpperFrontLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UpperFrontLegWidth, UpperFrontLegHeight, UpperFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerFrontLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LowerFrontLegWidth, lowerFrontLegHeight, LowerFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UpperFrontLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UpperFrontLegWidth, UpperFrontLegHeight, UpperFrontLegWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
  gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
   for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerFrontLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LowerFrontLegWidth, lowerFrontLegHeight, LowerFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
   for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UpperBackLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UpperBackLegWidth, UpperBackLegHeight, UpperBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * LowerBackLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LowerBackLegWidth, LowerBackLegHeight, LowerBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * UpperBackLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(UpperBackLegWidth, UpperBackLegHeight, UpperBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * LowerBackLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(LowerBackLegWidth, LowerBackLegHeight, LowerBackLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailFirst() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailDepth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailSecond() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailDepth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailThird() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailDepth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 0.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Carpet() {

    instanceMatrix = mult(modelViewMatrix, translate(5.0, -3.0, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale( 65, 0.1, 50) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 1.0 )
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function plane() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*heightPlane, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( widthPlane, heightPlane, depthPlane));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 3.0 );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFrontLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(widthLeg, heightLeg, widthLeg) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 3.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}
function rightFrontLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(widthLeg, heightLeg, widthLeg) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 3.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}
function leftBackLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(widthLeg, heightLeg, widthLeg) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 3.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}
function rightBackLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(widthLeg, heightLeg, widthLeg) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1f ( gl.getUniformLocation(program, "useTexture"), 3.0 ); 
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function quad(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    positionsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);
    
    positionsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);
    positionsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);

}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function configureTexture() {
    
    var image;
    var image1;
    var image2;
    var image3;
    var image4;
image1= document.getElementById("bump-carpet");;
image= document.getElementById("carpet");
image2=document.getElementById("cat-face");
image3=document.getElementById("fur");
image4=document.getElementById("bump-fur");

  var texture = gl.createTexture(); //  BUMP CARPET
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image1);
  // if it's a power of 2 in both dimensions then
  // we can generate mips, otherwise we'd have to do other things
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);


    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);

    var texture1 = gl.createTexture(); // COLOR CARPET
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);



    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap0"), 1);

    var texture2 = gl.createTexture(); //COLOR FACE
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize1, texSize1, 0, gl.RGB, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);
   
   

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap1"), 2);

    var texture3= gl.createTexture(); // COLOR FUR
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize1, texSize1, 0, gl.RGB, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap(gl.TEXTURE_2D);
   
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap2"), 3);

    var texture4= gl.createTexture(); // BUMP FUR
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize1, texSize1, 0, gl.RGB, gl.UNSIGNED_BYTE, image4);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap3"), 4);

}


//////////////////////
// ANIMATION
/////////////////////
var buttonAnimation = false;
var TorsoStepX = 0.003;
var TorsoStepY = 0.009;
var RotationStepLeft = 0.8;
var RotationStepRight = 0.8;
var RotationStepLeftBack = 0.8;
var RotationStepRightBack = 0.8;
var jump = true;
var walking = true;
var nearTable = false;
var finish = false;
var torsoAligned = false;
var preparingToJump = true;

function animation()
{

if(CatPositionX <-7.5)
CatPositionX = mix(CatPositionX,1,TorsoStepX);

//theta[leftUpperFrontLegId] = mix(theta[leftUpperFrontLegId], 200,RotationStep);

if(CatPositionX >= (-8.5)){
    //console.log("catposition "+ CatPositionX);
    nearTable=true;
    theta[leftUpperFrontLegId] = mix(theta[leftUpperFrontLegId],180,0.01);
    theta[leftUpperBackLegId] = mix(theta[leftUpperBackLegId],180,0.01);
    theta[rightUpperFrontLegId] = mix(theta[rightUpperFrontLegId],180,0.01);
    theta[rightUpperBackLegId] = mix(theta[rightUpperBackLegId],180,0.01);
    if(preparingToJump == true) {
    theta[torsoIdX] = mix(theta[torsoIdX],-27,0.05);
    theta[leftUpperBackLegId] = mix(theta[leftUpperBackLegId],-1,0.01);
    theta[rightUpperBackLegId] = mix(theta[rightUpperBackLegId],-1,0.01);
    theta[tailFirstId] = mix(theta[tailFirstId],30,0.05);
    theta[leftLowerFrontLegId]=mix(theta[leftLowerFrontLegId],30,0.05);
    theta[rightLowerFrontLegId]=mix(theta[leftLowerFrontLegId],30,0.05);
    }
}

if(CatPositionX < -7.5){
if (theta[leftUpperFrontLegId] <= 150 || theta[leftUpperFrontLegId] >=220)
{
    RotationStepLeft = -RotationStepLeft;
}


if (theta[rightUpperFrontLegId] <= 150 || theta[rightUpperFrontLegId] >=220)
{
    RotationStepRight = -RotationStepRight;
    
}

if (theta[leftUpperBackLegId] <= 150 || theta[leftUpperBackLegId] >=220)
{
    RotationStepLeftBack = -RotationStepLeftBack;
    
}

if (theta[rightUpperBackLegId] <= 150 || theta[rightUpperBackLegId] >=220)
{
    RotationStepRightBack = -RotationStepRightBack;
    
}
if(nearTable==false)
{
theta[leftUpperFrontLegId] = theta[leftUpperFrontLegId]+ RotationStepLeft;
theta[rightUpperFrontLegId] = theta[rightUpperFrontLegId]+ RotationStepRight;
theta[leftUpperBackLegId] = theta[leftUpperBackLegId]+ RotationStepLeftBack;
theta[rightUpperBackLegId] = theta[rightUpperBackLegId]+ RotationStepRightBack;
}
}
else 
{
    if(CatPositionY < 5.9 && jump== true)
    {
       // console.log("punto di arrivo"+CatPositionX);
        CatPositionX = mix(CatPositionX,2.5,0.005);
        CatPositionY = mix(CatPositionY,6.0,0.017);
                if(preparingToJump == true)
                {
                theta[leftUpperBackLegId] = mix(theta[leftUpperBackLegId],0,0.001);
                theta[rightUpperBackLegId] = mix(theta[rightUpperBackLegId],0,0.001);
                }
                    //theta[torsoIdX] = mix(theta[torsoIdX],-27,0.05);
                    theta[leftUpperFrontLegId] = mix(theta[leftUpperFrontLegId],140,1);
                    theta[leftUpperBackLegId] = mix(theta[leftUpperBackLegId],200,1);
                    theta[rightUpperFrontLegId] = mix(theta[rightUpperFrontLegId],140,1);
                    theta[rightUpperBackLegId] = mix(theta[rightUpperBackLegId],200,1);
              
    }
   
    if( (jump == false || CatPositionY >=5.8) && walking == true)
    {      
                jump=false;
               // CatPositionY = mix(CatPositionY,1.5,0.1);
                console.log("position y "+ CatPositionY);
                preparingToJump = false;
                if(torsoAligned == false)
                    {
                        
                        theta[leftUpperFrontLegId] = mix(theta[leftUpperFrontLegId],220,1);
                        theta[leftUpperBackLegId] = mix(theta[leftUpperBackLegId],220,1);
                        theta[rightUpperFrontLegId] = mix(theta[rightUpperFrontLegId],160,1);
                        theta[rightUpperBackLegId] = mix(theta[rightUpperBackLegId],160,1);
                        
                        
                        
                    }
    }
    

    if( (CatPositionY >=0.9 && jump == false) || walking == false)
    {
                walking= false;
                torsoAligned= true;
                CatPositionY = mix(CatPositionY,5.0,0.1);
                theta[torsoIdX] = mix(theta[torsoIdX], 0, 0.04);
                theta[tailFirstId] = mix(theta[tailFirstId],0,0.05);
                theta[leftLowerFrontLegId]=mix(theta[leftLowerFrontLegId],0,0.05);
                theta[rightLowerFrontLegId]= mix(theta[leftLowerFrontLegId],0,0.05);
                CatPositionX = mix(CatPositionX, 7.0, 0.005);

                if (theta[leftUpperFrontLegId] <= 160 || theta[leftUpperFrontLegId] >=220)
                {
                    RotationStepLeft = -RotationStepLeft;
                    
                }


                if (theta[rightUpperFrontLegId] <= 160 || theta[rightUpperFrontLegId] >=220)
                {
                    RotationStepRight = -RotationStepRight;
                    
                }

                if (theta[leftUpperBackLegId] <= 160 || theta[leftUpperBackLegId] >=220)
                {
                    RotationStepLeftBack = -RotationStepLeftBack;
                    
                }

                if (theta[rightUpperBackLegId] <= 160 || theta[rightUpperBackLegId] >=220)
                {
                    RotationStepRightBack = -RotationStepRightBack;
                    
                }
                if (CatPositionX >= 5.8)
                {
                    finish = true;

                }
                if(finish== false)
                {
                    
                theta[leftUpperFrontLegId] = theta[leftUpperFrontLegId]+ RotationStepLeft;
                theta[rightUpperFrontLegId] = theta[rightUpperFrontLegId]+ RotationStepRight;
                theta[leftUpperBackLegId] = theta[leftUpperBackLegId]+ RotationStepLeftBack;
                theta[rightUpperBackLegId] = theta[rightUpperBackLegId]+ RotationStepRightBack;
                }
        

    }
}
    
        initNodes(torsoIdX);
        initNodes(leftUpperFrontLegId);
        initNodes(rightUpperFrontLegId);
        initNodes(leftUpperBackLegId);
        initNodes(rightUpperBackLegId);
        
    

}


  
  
  
/////////////////////////////////
function init() {
  
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }
    
   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    aspect =  canvas.width/canvas.height;

    program = initShaders( gl, "vertex-shader", "fragment-shader");

    programMB= initShaders(gl, "vertex-shader-mb","fragment-shader-mb");

    gl.useProgram(program);

    ArrayVertices = gl.createVertexArray();
    gl.bindVertexArray(ArrayVertices);


    
        texture5 = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture5);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,canvas.width, canvas.height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    
    
                              
        CreationTexBlurring();
        
        

        frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        frameBuffer.width = canvas.width;
        frameBuffer.height = canvas.height;

        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture5, 0);

        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE) alert("Frame buffer not complete");
    
    
       
        //render to frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
    
        var depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer);
        
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,canvas.width,canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        gl.enable(gl.DEPTH_TEST);

        
        instanceMatrix = mat4();

   
      modelViewMatrix = mat4();
      cube();
      
      
      // TEXTURE BUFFER
      tBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
  
       texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
      gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texCoordLoc);
  
      vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    
    DrawScene();
    
        
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    nMatrix = normalMatrix(modelViewMatrix, true);
    gl.uniform4fv( gl.getUniformLocation(program, "uDiffuseProduct"), diffuseProduct);
    gl.uniform4fv( gl.getUniformLocation(program, "uLightPosition"), lightPosition);
    

    
    gl.uniformMatrix3fv( gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));
    gl.uniform4fv( gl.getUniformLocation(program, "uNormal"), normal);
    gl.uniform3fv( gl.getUniformLocation(program, "uObjTangent"), tangent);

 
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  gl.uniform1f ( gl.getUniformLocation(program, "catColor"), catColor );

     
    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.useProgram(programMB);

    buffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(mbPositions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(programMB, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( positionLoc );

    buffer3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer3);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(mbTextCoords), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation( programMB, "aTexCoord");
    gl.vertexAttribPointer( texCoordLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( texCoordLoc );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture5);
    gl.uniform1i( gl.getUniformLocation(programMB, "newImage"), 0);
    
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[0]);
    gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen0"),1);
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[1]);
    gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen1"),2);
    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[2]);
    gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen2"),3);


    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    allEvents();
    copyFrame = gl.createFramebuffer();
    render();
}



function render() {

SwitchTexture(TextureForBlurring[1],TextureForBlurring[2]);
SwitchTexture(TextureForBlurring[0],TextureForBlurring[1]);
SwitchTexture(texture5,TextureForBlurring[0]);

gl.useProgram(program);
 //rendere new frame
 eye = vec3(radius*Math.sin(theta1)*Math.cos(phi),radius*Math.sin(theta1)*Math.sin(phi), radius*Math.cos(theta1));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniform4fv( gl.getUniformLocation(program, "uLightPosition"), lightPosition);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"projectionMatrix"), false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelViewMatrix));
        

 DrawScene();
  if(buttonAnimation) animation();
      renderOnCanvas();
   

requestAnimationFrame(render);    

}

function allEvents(){
    document.getElementById("thetaSlider").onchange = function(event) {
        theta1 = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("radiusSlider").onchange = function(event) {
        radius = event.target.value;
     };
     document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
    };

    document.getElementById("startAnimation").onclick = function(event) {
        buttonAnimation = !buttonAnimation;
    };

    document.getElementById("Motion").onclick = function(event) {
        motionBlurFlag = !motionBlurFlag;
    };

    
    canvas.addEventListener("webglcontextlost", function() {
        alert('WebGL Context is lost, the page will be reloaded!');
        window.location.reload();
    }, false);
}

function DrawScene(){
    gl.bindVertexArray(ArrayVertices);
    gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
    
    //update
   configureTexture();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture5, 0);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(i=0; i<numNodes; i++) initNodes(i);

    for(i=0; i<NodesTable; i++) initTable(i);
    Carpet();
    traverse(torsoId);
    traverse1(planeId);
}

function SwitchTexture(from, to){

    gl.bindVertexArray(null)
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D,null);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D,null);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D,null);
    gl.useProgram(programMB);
    gl.bindFramebuffer(gl.FRAMEBUFFER,copyFrame);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, to, 0);

    gl.uniform1i(gl.getUniformLocation(programMB,"mbActivation"),0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,from);
    gl.uniform1i( gl.getUniformLocation(programMB, "newImage"), 0);

    gl.viewport(0,0,canvas.width,canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,6);
}

function renderOnCanvas() {
    //render effect
   gl.bindVertexArray(null)
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   gl.useProgram(programMB);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D,texture5);
   gl.uniform1i(gl.getUniformLocation(programMB,"newImage"),0);

       gl.activeTexture(gl.TEXTURE1)
       gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[0]);
       gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen0"),1);
       gl.activeTexture(gl.TEXTURE2)
       gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[1]);
       gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen1"),2);
       gl.activeTexture(gl.TEXTURE3)
       gl.bindTexture(gl.TEXTURE_2D,TextureForBlurring[2]);
       gl.uniform1i(gl.getUniformLocation(programMB,"pastScreen2"),3);
   
  gl.uniform1i(gl.getUniformLocation(programMB,"mbActivation"),motionBlurFlag);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES,0,6);
}

function CreationTexBlurring(){
    TextureForBlurring.push(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, TextureForBlurring[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    TextureForBlurring.push(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, TextureForBlurring[1]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    TextureForBlurring.push(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, TextureForBlurring[2]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

 

