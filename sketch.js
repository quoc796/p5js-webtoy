//README
//click and drag to play

//SCENE MANAGER
var doneSetup;
var scenes = [[beginStart, beginPlay, beginEnd,beginMclicked, beginMdragged, beginMreleased], [gamePlayStart, gamePlayPlay, gamePlayEnd,gamePlayMclicked, gamePlayMdragged, gamePlayMreleased]]
var currentScene = 0;

//GAME SETTINGS
var frameR = 60;
function setup() {
  createCanvas(900, 600);
  frameRate(frameR);
  currentScene = 0;
  beginStart();
  

  
}

function draw() {

  if(doneSetup)scenes[currentScene][1]();
}

function ChangeScene(newScene)
{  
    doneSetup = false;
    scenes[currentScene][2]();
    currentScene = newScene;
    scenes[currentScene][0]();
}


//MOUSE EVENT HANDLER
function mousePressed()
{
  
  scenes[currentScene][3]();

}
function mouseDragged()
{
  
  scenes[currentScene][4]();
}
function mouseReleased()
{
  
  scenes[currentScene][5]();

}






//BEGIN SCENE
var buttonPlay
function beginStart()
{
  buttonPlay = createButton("Start");
  buttonPlay.position(width/2, height/ 2);
  buttonPlay.center("horizontal");
  buttonPlay.mouseClicked(() =>ChangeScene(1));
  doneSetup = true;
}
function beginPlay()
{
    background(255);
}
function beginEnd()
{
  buttonPlay.hide();
}

//BEGIN MOUSE HANDLER
function beginMclicked()
{
  
}

function beginMdragged()
{
  
}

function beginMreleased()
{
  
}






//PLAY SCENE

//BALL CONTROLLER
var ball, ballD,ballspd = 0, fpoint;

//CUSTOMIZEABLE
var radius = 50, defaultSpd = 10;




//SHARD CONTROLLER
var EffectAtive = false;
var shardDuration = 2;

//for line
var shardLength = 30;
//for ellilpse
var shardRadius = 3;
//SHARD POOLING;
var cPs = 0;
var shardPool = [];
var sEachCollision = 20;


//BALL CONTROLLER
function gamePlayStart()
{
  
    //SETUP BALL
  ball = createVector(width / 2, height / 2);
  ballD = createVector(0, 0);
  fpoint = createVector(0, 0);
  ballSpeed = createVector();
  //SETUP SHARDs
  addToPool(sEachCollision);
  doneSetup = true;
}
function gamePlayPlay() 
{
  background(74, 72, 72);
  fill(255, 0, 0);
  ellipse(ball.x, ball.y, radius * 2,radius*2);
  var finalV = createVector(ballD.x * ballspd, ballD.y * ballspd);
  ball.add(finalV);
  ballspd *= 0.97;
  bouncingHandler();
  
}
function gamePlayEnd()
{
  
}




function bouncingHandler()
{
  
  if (ball.x - radius < 0 || ball.x + radius > width)
  {
    ballD.x = -ballD.x;
    ballspd *= 0.97;
    if(ball.x - radius < 0)
    {
        startCollisionEffect(0 , ball.y);
    }
    else
    {
        startCollisionEffect(width, ball.y);
    }
  }
  if (ball.y - radius < 0 || ball.y + radius > height)
  {
    ballD.y = -ballD.y;
    ballspd *= 0.97
    if(ball.y - radius < 0)
    {
        startCollisionEffect(ball.x , 0);
    }
    else
    {
        startCollisionEffect(ball.x, height);
    }
  }
  ball.x = clamp(ball.x, 0 + radius, width- radius);
  ball.y = clamp(ball.y, 0 + radius, height - radius);
  
  
  if(EffectAtive)
  {
    onCollisionEffect();
  }
}
function startCollisionEffect(px, py)
{
     EffectAtive = true;
  
    var shardOA = getShards();
    for(var i = shardOA; i < shardOA + sEachCollision; i++)
    {
      shardPool[i].x = px;
      shardPool[i].y = py;
      shardPool[i].duration = shardDuration;
      shardPool[i].isActive = true;
      shardPool[i].rotation = shardPool[i].defaultRotation;
      
    }
}
function onCollisionEffect()
{
    EffectAtive = false;
    var shape = 0;

    for(var i = 0 ; i < cPs; i++)
    {
        if(!shardPool[i].isActive)
        {
         
           continue;
        }
        shardPool[i].duration -= getDeltaTime();
        
        if(shardPool[i].duration < 0)
        {
          shardPool[i].isActive = false;
        }
        else
        {
          EffectAtive = true;
          shardPool[i].x += shardPool[i].spdX;
          shardPool[i].y += shardPool[i].spdY;
          thereAreActive = true;
          
          //simple Line
          push();
          stroke(255);
          if(shape == 0)
          {
            var rotation = createVector(shardLength,0);
            shardPool[i].rotation += shardPool[i].rotationSpd;
            rotation.rotate(shardPool[i].rotation);
            var endPoint = createVector(rotation.x + shardPool[i].x,rotation.y + shardPool[i].y)
            line(shardPool[i].x, shardPool[i].y,endPoint.x,endPoint.y);
           
          }
          else if (shape == 1)
          {
            fill(255)
            ellipse(shardPool[i].x, shardPool[i].y, shardRadius * 2,shardRadius*2);
            
          }
          
           pop();
          
          shape = (shape + 1)%2
          
        }
        
    }
}




//GAMEPLAY MOUSE HANDLER
function gamePlayMclicked()
{
    fpoint.x = mouseX;
    fpoint.y = mouseY;
}

function gamePlayMdragged()
{
  
  
     push();
     var dline = createVector(fpoint.x - mouseX, fpoint.y - mouseY);
     dline.normalize();
     dline.x *= 100;
     dline.y *= 100;
     stroke(255)
     strokeWeight(5);
     line(ball.x,ball.y,dline.x +ball.x ,dline.y + ball.y);
      
     pop();
  
}


function gamePlayMreleased()
{
    ballD.x =  fpoint.x - mouseX;
  ballD.y =  fpoint.y - mouseY;
  ballD.normalize();
  ballspd = defaultSpd;
}






//POOLING



function addToPool(c)
{
  for(var i = cPs; i < cPs + c; i++)
  {
      shardPool[i] = 
      {
        isActive: false,
        x: 0,
        y: 0,
        rotation:0,
        defaultRotation: random(-180,180),
        rotationSpd :random(-0.1,0.1),
        duration: 0,
        spdX : random(-10, 10),
        spdY : random(-10,10),
        
        
        
      }
  }
  cPs += c;
}

function getShards()
{
  
  var shardL = -1;
  for(var i = 0; i < cPs ;i += sEachCollision)
  {
     if(!shardPool[i].isActive)
     {
        shardL = i;
        break;
     }
    
  }
     
  
  if(shardL == -1)
  {
    var currentIndex = cPs;
    addToPool(sEachCollision);
    return currentIndex;
  }
  else return shardL;

}





//UTILITY
function clamp(val, minVal, maxVal) {
  return min(max(val, minVal), maxVal);
}
function getDeltaTime()
{
   return deltaTime / 1000;
}

