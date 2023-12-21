
// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// game-related variables
var score1 = 0, score2 = 0;
// you can change this to any positive whole number
var maxScore = 5;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.2;

// game function

function setup()
{
	// update the board to reflect the max score for match win
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
	
	// now reset player and opponent scores
	score1 = 0;
	score2 = 0;
	
	// set up all the 3D objects in the scene	
	createScene();
	draw();
}

function createScene()
{
	// set the scene size
	var WIDTH = 640,
	  HEIGHT = 480;

	// set camera attributes
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();
	scene.add(camera);
	
	// set a default position for the camera
	camera.position.z = 320;
	
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// create the paddle1 material + color 
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x0F1295
		});
	// create the paddle2 material + color 
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xF81D14
		});
	// create the plane material + color
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x12660
		});
	// create the table material + color
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x124660
		});
	
	// create the ground material + color
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x12660
		});
		
		
	// create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.93,	// 93% of table width, since we want to show where the ball goes out-of-bounds
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1,	// lining for billiard table
		planeHeight * 1.10,
		100,				// arbitrary depth
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	//sink the table into the ground by 50. extra 1 is so the plane can be seen
	scene.add(table);
	table.receiveShadow = true;	
		
	// set up sphere variables, lower 'segment' and 'ring' values will increase performance
	var radius = 5,
		segments = 6,
		rings = 6;
		
	// // create the sphere material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xF5F0D7//0xFFFFFF
		});
		
	// Create a ball with sphere geometry
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	// set ball above the table surface
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	// // set up the paddle vars
	paddleWidth = 8;
	paddleHeight = 30;
	paddleDepth = 8;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);
	  
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth + 5;
	paddle2.position.x = fieldWidth/2 - paddleWidth -5;
	
	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
		
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry( 
	  1000, 
	  1000, 
	  3, 
	  1, 
	  1,
	  1 ),

	  groundMaterial);
    // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -130;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	// // create a point light
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// pointLight postition 
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;

	scene.add(pointLight);
		
	// spot light to cast shadow 
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	player2PaddleMovement();
}

function ballPhysics()
{
	// if ball goes off the Player1 side
	if (ball.position.x <= -fieldWidth/2)
	{	
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;

		resetBall(2);
		matchScoreCheck();	
	}
	// if ball goes off the PLayer2 side
	if (ball.position.x >= fieldWidth/2)
	{	
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;

		resetBall(1);
		matchScoreCheck();	
	}
	// if ball goes off the top side
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// if ball goes off the bottom side
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	// limit ball y-speed to 2x the x-speed, keeps game playable for humans
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}
// Handles player1 paddle movement
function playerPaddleMovement()
{
	// move up
	if (Key1.isDown(Key1.W))		
	{
		// if paddle is not touching the side of plane we move
		if (paddle1.position.y < fieldHeight * 0.40)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
		}
	}	
	// move down
	else if (Key1.isDown(Key1.S))
	{
		// if paddle is not touching the side of table we move 
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
		}
	}
	else
	{
		// stop the paddle
		paddle1DirY = 0;
	}
	//animate softly the size of the paddle  to give depth impression
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;	
	paddle1.position.y += paddle1DirY;
}
//all same as Player1
function player2PaddleMovement()
{
	//move up
	if (Key2.isDown(Key2.UP_ARROW))		
	{
		if (paddle2.position.y < fieldHeight * 0.40)
		{
			paddle2DirY = paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirY = 0;
		}
	}
	// move down
	else if (Key2.isDown(Key2.DOWN_ARROW))
	{
		if (paddle2.position.y > -fieldHeight * 0.45)
		{
			paddle2DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirY = 0;
		}
	}
	else
	{
		paddle2DirY = 0;
	}
	
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
	paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;	
	paddle2.position.y += paddle2DirY;
}

function cameraPhysics() {
  //dynamic shadow
    spotLight.position.x = ball.position.x * 2;
    spotLight.position.y = ball.position.y * 2;

  //rotate to to see the side of the table
	camera.position.x = 0;
	camera.position.z = 220; 
	camera.position.y = -350;
	
	camera.rotation.x = 1;
	camera.rotation.z = 0;
	camera.rotation.y = 0;

}
//paddle collision
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	// if ball is aligned with paddle1 on x plane check the front and the middle of the paddle
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
	// PlLAYER2 LOGIC
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x -5) //-5 helps to give good impression of colision for P2
	{
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			if (ballDirX > 0)
			{
				ballDirX = -ballDirX;
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	// reset ball at center
	ball.position.x = 0;
	ball.position.y = 0;
	
	// sent ball opposite way if Player lost point
	if (loser == 1)
	{
		ballDirX = -1;
	}
	//same
	else
	{
		ballDirX = 1;
	}
}

var bounceTime = 0;
// check score Match 
function matchScoreCheck()
{
	// if player has 5 points
	if (score1 >= maxScore)
	{
		// stop ball
		ballSpeed = 0;
		// write BLUE message
		document.getElementById("scores").innerHTML = "BLUE wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		// make paddle bounce up and down
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// celebration 
		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	else if (score2 >= maxScore)
	{
		ballSpeed = 0;
		// write RED message
		document.getElementById("scores").innerHTML = "RED wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";

		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;

		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}