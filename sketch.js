var PLAY = 1 ;
var END = 0 ;
var gameState = PLAY ;

var trex ,trex_running; 
var ground, invisibleGround, groundImage ;

var cloudsGroup, cloudImage ;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6 ;

var score ;
var gameOverImg,restartImg ;
var jumpSound , checkPointSound, dieSound ;

// preload function to load all images,sound 
function preload(){

  trex_running = loadAnimation ("trex1.png" , "trex3.png" , "trex4.png") ;
  trex_collided = loadAnimation ("trex_collided.png") ;

  groundimage = loadImage ("ground2.png") ;

  cloudimage =loadImage ("cloud.png") ;

  cactus1 = loadImage ("obstacle1.png") ;
  cactus2 = loadImage ("obstacle2.png") ;
  cactus3 = loadImage ("obstacle3.png") ;
  cactus4 = loadImage ("obstacle4.png") ;
  cactus5 = loadImage ("obstacle5.png") ;
  cactus6 = loadImage ("obstacle6.png") ;
  
  gameOverImage = loadImage ("gameOver.png") ;
  restartImg = loadImage ("restart.png") ;

  diesound = loadSound ("die.mp3") ;
  checksound = loadSound ("checkPoint.mp3") ;
  jumpsound = loadSound ( "jump.mp3") ;
}

function setup(){
  
  createCanvas(windowWidth,windowHeight) ;

  edges = createEdgeSprites () ;

  //create a trex sprite
  trex = createSprite( 50,height-70,20,50) ;
  trex.addAnimation ("running" , trex_running) ;
  trex.addAnimation ("collided" , trex_collided) ;
  trex.scale = 0.8 ;

  trex.setCollider ("circle",0,0,45) ;
  trex.debug = false ;

  ground = createSprite (width/2,height-20,width,20) ;
  ground.addImage (groundimage) ; 
  ground.scale= 2;
  
  restart = createSprite (width/2,height/2) ;
  restart.addImage (restartImg) ;
  restart.scale = 0.9 ;

  gameOver = createSprite (width/2,height/3 + 50) ;
  gameOver.addImage (gameOverImage) ;
  gameOver.scale = 0.9 ;

  invisibleground = createSprite(width/2,height-10,width,10) ;
  invisibleground.visible = false ;
 
  obstacleGroup = new Group () ; 
  cloudGroup = new Group () ;
  
  score = 0 ;

  console.log ("hellow"+"twinkle") ;
}

function draw(){

  background("white") ;
  textSize (20) ;
  text("score:" + score , width-200,50) ;
  

  
  if(gameState === PLAY) { 
    
    gameOver.visible = false ;
    restart.visible = false ;

    ground.velocityX = -(2+score / 100 ) ;

    score = score + Math.round( getFrameRate () / 60 ) ;

    // condition for playing checkpoint sound 
    if(score > 0 && score% 1500 === 0 ) {
      checksound.play () ;
    }

    // condition for making ground infinite
    if(ground.x < 0) {
      ground .x =ground.width/2 ;  
    }

    // condition for making the trex jump when we press space
    if((touches.length>0||keyDown("space"))&&trex.y>=height-147) {
      trex.velocityY = -10 ;
      trex.changeAnimation("collided" , trex_collided) ;
      jumpsound.play () ;
      touches=[]
    }

    if (trex.y>=height-70) {
      trex.changeAnimation("running" , trex_running) ;  
    }

    trex.velocityY = trex.velocityY +1 ;

    // calling functions spawn clouds and spzwn obstacles
    spawnClouds () ;
    spawnObstacles () ;

   // condition to change gameState to end 
    if(obstacleGroup. isTouching (trex) ) { 
      gameState = END ;
      diesound.play () ;
    }
  }
  else if(gameState === END) {

    gameOver.visible = true ;
    restart.visible = true ;

    ground.velocityX = 0 ;
    trex.velocityY = 0 ;

    trex.changeAnimation("collided" , trex_collided) ;
    
    obstacleGroup.setVelocityXEach (0) ;
    cloudGroup.setVelocityXEach(0) ;
    
    obstacleGroup.setLifetimeEach (-1) ;
    cloudGroup.setLifetimeEach (-1) ;
  }

  trex.collide(invisibleground) ;

  // if condition make restart button functional
  if(mousePressedOver (restart)) {
    console.log ("restartTheGame") ;
    reset () ;
  }

  drawSprites() ;
}  

function reset () {
  
  gameState = PLAY ;

  gameOver.visible = false ;
  restart.visible = false ;

  obstacleGroup.destroyEach () ;
  cloudGroup.destroyEach () ;

  score = 0 ;
}
function spawnClouds (){

  if (frameCount%60===0){  
    cloud = createSprite (width,height/2,40,10) ;
    cloud.addImage(cloudimage) ;
    cloud.scale=1 ;
    cloud.velocityX  = -7 ;

    cloud.y=Math.round(random(50,500)) ;

    cloud.depth = trex.depth ;
    trex.depth=trex.depth+1 ;

    cloud.lifetime = 1000;

    cloudGroup.add (cloud) ;
  }

}

function spawnObstacles  () {

  if (frameCount % 60 === 0)  {
    obstacle = createSprite (width,height-55,10,40) ;
     //obstacle.setCollider ("circle",0,0,55) ;
    obstacle.debug = false ;
    obstacle.velocityX = -(6+score / 100 ) ;
    rand = Math.round(random(1,6)) ; 
    switch(rand) {
      case 1 : obstacle.addImage (cactus1) ;
      break ;
      case 2 : obstacle.addImage (cactus2) ;
      break ;
      case 3 : obstacle.addImage (cactus3) ;
      break ; 
      case 4 : obstacle.addImage (cactus4) ;
      break ;
      case 5 : obstacle.addImage (cactus5) ;
      break ;
      case 6 : obstacle.addImage (cactus6) ;
      break ;
      default : break ; 
    }
    obstacle.scale = 0.9 ;
    obstacle.lifetime = 650 ;

    obstacleGroup.add (obstacle) ;
  } 
}

