"use strict";

var canvas;
var gl;

var numberOfPositions  = 186;
var program;
var positions = [];

var vertices = [

  // backseat

  /*0*/ vec4(-0.2, -0.2,  0.08, 1.0), //a
  /*1*/ vec4(-0.2,  0.3,  0.08, 1.0), //b
  /*2*/ vec4(0.2,  0.3,  0.08, 1.0), //c
  /*3*/ vec4(0.2, -0.2,  0.08, 1.0), //d
  /*4*/ vec4(-0.2, -0.2, -0.08, 1.0), //e 
  /*5*/ vec4(-0.2,  0.3, -0.08, 1.0), //f
  /*6*/ vec4(0.2,  0.3, -0.08, 1.0), //g
  /*7*/ vec4(0.2, -0.2, -0.08, 1.0), //h

  // seat

  /*8*/ vec4(-0.2, -0.3, 0.5, 1.0), //i
  /*9*/ vec4(-0.2, -0.2, 0.5, 1.0), //j
  /*10*/  vec4(0.2, -0.2,  0.5, 1.0), //k
  /*11*/  vec4(0.2, -0.3,  0.5, 1.0), //l
  /*12*/  vec4(-0.2, -0.3, -0.08, 1.0),//m
  /*13*/  vec4(0.2, -0.3, -0.08, 1.0), //n


//right back leg

/*14*/   vec4(0.15, -0.6, 0.08, 1.0),//o
/*15*/   vec4(0.15, -0.3, 0.08, 1.0),//p
/*16*/   vec4(0.2, -0.6, 0.08, 1.0 ),//r
/*17*/   vec4(0.15, -0.6, -0.08, 1.0),//s
/*18*/   vec4(0.15, -0.3, -0.08, 1.0),//t
/*19*/   vec4(0.2, -0.6, -0.08, 1.0),//u

  //left back leg
/*20*/   vec4(-0.15, -0.6, 0.08, 1.0),//q
/*21*/   vec4(-0.15, -0.3, 0.08, 1.0),//v
/*22*/   vec4(-0.2, -0.6, 0.08, 1.0 ),//w
/*23*/   vec4(-0.15, -0.6, -0.08, 1.0),//z
/*24*/   vec4(-0.15, -0.3, -0.08, 1.0),//a1
/*25*/   vec4(-0.2, -0.6, -0.08, 1.0),//b1

// right front leg
/*26*/   vec4(0.2, -0.3, 0.34, 1.0), // c1
/*27*/   vec4(0.2, -0.6, 0.34, 1.0),  //d1
/*28*/   vec4(0.15,-0.6, 0.34, 1.0),  //e1
/*29*/   vec4(0.15,-0.3,0.34, 1.0),  //f1
/*30*/   vec4(0.15, -0.3, 0.5, 1.0),  //g1
/*31*/   vec4(0.15, -0.6, 0.5, 1.0),  //h1
/*32*/   vec4(0.2, -0.6, 0.5, 1.0),   //i1


// left front leg
/*33*/   vec4(-0.2, -0.3, 0.34, 1.0), // j1
/*34*/   vec4(-0.2, -0.6, 0.34, 1.0),  //k1
/*35*/   vec4(-0.15,-0.6, 0.34, 1.0),  //l1
/*36*/   vec4(-0.15,-0.3, 0.34, 1.0),  //m1
/*37*/   vec4(-0.15, -0.3, 0.5, 1.0),  //n1
/*38*/   vec4(-0.15, -0.6, 0.5, 1.0),  //o1
/*39*/   vec4(-0.2, -0.6, 0.5, 1.0)   //p1



];


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var light_flag = true;

var tr = mat4();
var tr1 = mat4();

var axis = 1;
var theta = [0, 0, 0];
var thetaLoc;
var trLoc;

var delay = 100;
var direction = true;
var flag= true;

var ctmLoc;

///////// PERSPECTIVE PROJECTION /////////////////
var near = 0.3;
var far = 5.0;
var radius = 4.0;
var theta1 = 0.0;
var phi = 0.0;
var quantiz = true;



var color1 = vec4(0.0, 0.0, 0.0, 1.0);
var color2 = vec4(1.0, 0.0, 0.0, 1.0);
var color3 = vec4(1.0, 1.0, 0.0, 1.0);
var color4 = vec4(0.0, 1.0, 0.0, 1.0);
var color5 = vec4(0.0, 0.0, 1.0, 1.0);
var color6 = vec4(1.0, 0.0, 1.0, 1.0);
var color7 = vec4(0.0, 1.0, 1.0, 1.0);
var color8 = vec4(1.0, 1.0, 1.0, 1.0);

var r1 = 0.0;
var g1 = 0.0;
var b1 = 0.0;

var r2 = 1.0;
var g2 = 0.0;
var b2 = 0.0;

var r3=  1.0;
var g3 = 1.0;
var b3 = 0.0;

var r4 = 0.0;
var g4 = 1.0;
var b4 = 0.0;

var r5 = 0.0;
var g5 = 0.0;
var b5 = 1.0;

var r6 = 1.0;
var g6 = 0.0;
var b6 = 1.0;

var r7 = 0.0;
var g7 = 1.0;
var b7 = 1.0;

var r8 = 1.0;
var g8 = 1.0;
var b8 = 1.0;

var Colors = [

  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8

];

// function which receives an angle in deg  and compute it in rad
  function fromDegToRad(angle) {
    return angle * (Math.PI/180);
  }

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
/////////////////////////////////////////////////////



/////////////// FOR THE LIGHT SOURCE ////////////////////////////
var normalsArray = [];
var lightPosition = vec4(0.0, 1.0, 0.7, 1.0 ); 
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;

var cutoffAngle  = 10;
var lightX = 0.0;
var lightY = -0.45;
var lightZ = -0.25;
var lightDirection = vec3(lightX, lightY, lightZ);
var attenuation = 0.0;
var mix = 0.5;
//////////////////////////////////////////////////////////////////

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    ////////////// BUFFER FOR NORMALS //////////////
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
    ////////////////////////////////////////////////


    //////////// BUFFER FOR VERTICES //////////////////
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  ////////////////////////////////////////////////////////////

   
  ///////////////// BUFFER FOR COLORS ///////////////////
   
 /* var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var myColorLoc = gl.getAttribLocation(program, "myColor");
  gl.vertexAttribPointer(myColorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(myColorLoc);*/

  ////////////////////////////////////////////////////////////
    
  
    
    //event listeners for buttons
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    document.getElementById("Controls" ).onclick = function(event) {
        switch(event.target.index) {
          case 0:
            direction = !direction;
            break;
         case 1:
            delay /= 2.0;
            break;
         case 2:
            delay *= 2.0;
            break;
       }
    };
    document.getElementById("ButtonToggle").onclick = function(){flag = !flag;};

    document.getElementById("light").onclick = function(){
      gl.uniform1f(gl.getUniformLocation(program,
        "light_flag"), light_flag) 
        light_flag = !light_flag;
      
      };

    // sliders for viewing parameters

    document.getElementById("zFarSlider").onchange = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").onchange = function(event) {
        near = event.target.value;
    };
    document.getElementById("radiusSlider").onchange = function(event) {
       radius = event.target.value;
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        theta1 = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("aspectSlider").onchange = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").onchange = function(event) {
        fovy = event.target.value;
    };

    document.getElementById("spotAngle").onchange = function(event) {
      cutoffAngle = event.target.value;
    };

    document.getElementById("spotDirectionX").onchange = function(event) {
      lightDirection[0] = event.target.value;
    };
    document.getElementById("spotDirectionY").onchange = function(event) {
      lightDirection[1] = event.target.value;
    };
    document.getElementById("spotDirectionZ").onchange = function(event) {
      lightDirection[2]= event.target.value;
    };

   

     document.getElementById("spotPositionX").onchange = function(event) {
    lightPosition[0] = event.target.value;
    };
    document.getElementById("spotPositionY").onchange = function(event) {
      lightPosition[1] = event.target.value;
    };
    document.getElementById("spotPositionZ").onchange = function(event) {
      lightPosition[2] = event.target.value;
       
    }; 
    
    document.getElementById("attenuation").onchange = function(event) {
      attenuation= event.target.value;
    };
      document.getElementById("mixing").onchange = function(event) {
        mix= event.target.value;
      };

    document.getElementById( "quantiz" ).onclick = function () {
      gl.uniform1f(gl.getUniformLocation(program,
        "quantiz"), quantiz) 
        quantiz = !quantiz;
  };

  document.getElementById("r1").onchange = function(event) {
    color1[0]= event.target.value;
    
    
  };
  document.getElementById("g1").onchange = function(event) {
    color1[1]= event.target.value;
    
  };
  document.getElementById("b1").onchange = function(event) {
    color1[2]= event.target.value;
    
  };

  document.getElementById("r2").onchange = function(event) {
    color2[0]= event.target.value;
  };
  document.getElementById("g2").onchange = function(event) {
    color2[1]= event.target.value;
  };
  document.getElementById("b2").onchange = function(event) {
    color2[2] = event.target.value;
  };

  document.getElementById("r3").onchange = function(event) {
    color3[0]= event.target.value;
  };
  document.getElementById("g3").onchange = function(event) {
    color3[1]= event.target.value;
  };
  document.getElementById("b3").onchange = function(event) {
    color3[2]= event.target.value;
  };

  document.getElementById("r4").onchange = function(event) {
    color4[0]= event.target.value;
  };
  document.getElementById("g4").onchange = function(event) {
    color4[1]= event.target.value;
  };
  document.getElementById("b4").onchange = function(event) {
    color4[2]= event.target.value;
  };

  document.getElementById("r5").onchange = function(event) {
    color5[0]= event.target.value;
  };
  document.getElementById("g5").onchange = function(event) {
    color5[1]= event.target.value;
  };
  document.getElementById("b5").onchange = function(event) {
    color5[2]= event.target.value;
  };

  document.getElementById("r6").onchange = function(event) {
    color6[0]= event.target.value;
  };
  document.getElementById("g6").onchange = function(event) {
    color6[1]= event.target.value;
  };
  document.getElementById("b6").onchange = function(event) {
    color6[2]= event.target.value;
  };

  document.getElementById("r7").onchange = function(event) {
    color7[0]= event.target.value;
  };
  document.getElementById("g7").onchange = function(event) {
    color7[1]= event.target.value;
  };
  document.getElementById("b7").onchange = function(event) {
    color7[2]= event.target.value;
  };

  document.getElementById("r8").onchange = function(event) {
    color8[0]= event.target.value;
  };
  document.getElementById("g8").onchange = function(event) {
    color8[1]= event.target.value;
  };
  document.getElementById("b8").onchange = function(event) {
    color8[2]= event.target.value;
  };
  

  
      
      var ambientProduct = mult(lightAmbient, materialAmbient);
      var diffuseProduct = mult(lightDiffuse, materialDiffuse);
      var specularProduct = mult(lightSpecular, materialSpecular);

    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
    ctmLoc = gl.getUniformLocation(program, "ctm");

    
    gl.uniform4fv( gl.getUniformLocation(program,
        "ambientProduct"),flatten(ambientProduct) );
      gl.uniform4fv( gl.getUniformLocation(program,
        "diffuseProduct"),flatten(diffuseProduct) );
      gl.uniform4fv( gl.getUniformLocation(program,
        "specularProduct"),flatten(specularProduct) );
      
      gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );

        
        


    render();
}


function colorCube()
{
  //backrest
    quad(1, 0, 3, 2); 
    quad(2, 3, 7, 6); 
    quad(6, 5, 1, 2); 
    quad(4, 5, 6, 7); 
    quad(5, 4, 0, 1); 

//seat

    quad(10,9,8,11); 
    quad(7,10,11,13); 
    quad(4,7,13,12); 
    quad(9,4,12,8); 
    quad(9,10,7,4); 
    quad(11,8,12,13);

// right back leg

    quad(14,17,19,16); 
    quad(3,16,19,7); 
    quad(15,18,17,14); 
    quad(13,19,17,18); 
    quad(15,14,16,3); 
   

// left back leg

    quad(21,20,23,24); 
    quad(20,22,25,23); 
    quad(22,0,4,25); 
    quad(12,24,23,25); 
    quad(15,3,16,14); 
   

  // right front leg
    quad(11,32,27,26); 
    quad(32,31,28,27); 
    quad(31,30,29,28); 
    quad(11,30,31,32); 
    quad(31,26,27,28); 

  // left front leg
  quad(37,8,39,38); 
  quad(37,38,35,36); 
  quad(38,39,34,35); 
  quad(39,8,33,34); 
  quad(33,36,35,34); 
}

function quad(a, b, c, d) {
   // used to compute the normal of the faces
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);


     positions.push(vertices[a]);
     normalsArray.push(normal);
     positions.push(vertices[b]);
     normalsArray.push(normal);
     positions.push(vertices[c]);
     normalsArray.push(normal);
     positions.push(vertices[a]);
     normalsArray.push(normal);
     positions.push(vertices[c]);
     normalsArray.push(normal);
     positions.push(vertices[d]);
     normalsArray.push(normal);
}
 function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    console.log("value of angle is "+ cutoffAngle);
    
    console.log("value of lightposition "+ lightPosition);
    console.log("value of lightDirection "+ lightDirection);
    console.log("value of mix "+ mix);
    console.log("value of attenuation "+ attenuation);


    eye = vec3(radius*Math.sin(theta1)*Math.cos(phi),
    radius*Math.sin(theta1)*Math.sin(phi), radius*Math.cos(theta1));
    

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    

    if (flag) theta[axis] += (direction ? 0.9 : -0.5);

    var rot = mat4();
    var ctm = mat4 ();
    rot = mult(rot, rotateX(theta[xAxis]));
    rot = mult(rot, rotateY(theta[yAxis]));
    rot = mult(rot, rotateZ(theta[zAxis]));
  
    tr  = translate(0.2,  0.3,  0.08);
    tr1 = translate(-0.2,  -0.3,  -0.08);

    ctm = mult(ctm,tr);
    ctm = mult(ctm,rot);
    ctm = mult(ctm,tr1);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));
    
    gl.uniform3fv(gl.getUniformLocation(program, "lightDirection"), lightDirection);
    gl.uniform3fv(gl.getUniformLocation(program, "eye"), eye);
    gl.uniform1f(gl.getUniformLocation(program, "cutoffAngle"), Math.cos(fromDegToRad(cutoffAngle)));
    gl.uniform1f( gl.getUniformLocation(program,"attenuation"),attenuation);
    gl.uniform1f( gl.getUniformLocation(program,"mixing"),mix);
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform4fv( gl.getUniformLocation(program, "myColor"),flatten(Colors));
        
      gl.drawArrays(gl.TRIANGLES, 0, numberOfPositions);

      setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}
