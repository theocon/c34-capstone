const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, fruit, rope, fruit_con;

var bg_img;
var food;
var bunny_img;

var button;
var bunny;
var blink, eat, sad;

var bgsound, sadsound, cutsound, eatingsound, airsound;
var mutebutton

var blowerbtn

var cutbtn_2;
var cutbtn_3;
var rope_2;
var rope_3;

var fruit_con_2;
var fruit_con_3;

var greystar;
var yellowstar;
var empty_star;
var star_1;
var star_2;
var star_display
var star_img


function preload(){
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  bunny_img = loadImage('rabbit-01.png');
  blink = loadAnimation('blink_1.png', 'blink_2.png','blink_3.png');
  eat = loadAnimation('eat_0.png', 'eat_1.png','eat_2.png','eat_3.png','eat_4.png');
  sad = loadAnimation('sad_1.png','sad_2.png','sad_3.png');
  greystar = loadImage('g_star1.png');
  yellowstar = loadImage('star.png');
  star_img = loadImage('star.png');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;

  empty_star = loadAnimation('empty.png');
  star_1 = loadAnimation('one_star.png');
  star_2 = loadAnimation('stars.png');


  bgsound = loadSound('sound1.mp3');
  sadsound = loadSound('sad.wav');
  cutsound = loadSound('rope_cut.mp3');
  eatingsound = loadSound('eating_sound.mp3');
  airsound = loadSound('air.wav');
}

function setup() {
  createCanvas(windowWidth - 20,windowHeight - 20);
  frameRate(80);
  
  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bgsound.play();
  bgsound.setVolume(0.5);

  star_display = createSprite(50,20,30,30);
  star_display.scale = 0.2;
  star_display.addAnimation('empty', empty_star);
  star_display.addAnimation('one', star_1);
  star_display.addAnimation('two',star_2);
  star_display.changeAnimation('empty');

  star_2 = createSprite(50,330,20,20);
  star_2.addImage(star_img);
  star_2.scale = 0.02;

  star = createSprite(320,50,20,20);
  star.addImage(star_img);
  star.scale = 0.02;


  button = createImg('cut_btn.png');
  button.position(200,30);
  button.size(50,50);
  button.mouseClicked(drop);

  cutbtn_2 = createImg('cut_btn.png');
  cutbtn_2.position(780, 30);
  cutbtn_2.size(50,50);
  cutbtn_2.mouseClicked(drop_2);

  cutbtn_3 = createImg('cut_btn.png');
  cutbtn_3.position(480, 30);
  cutbtn_3.size(50,50);
  cutbtn_3.mouseClicked(drop_3);

  mutebutton = createImg('mute.png')
  mutebutton.position(width - 100,50);
  mutebutton.size(50,50);
  mutebutton.mouseClicked(mute);

  blowerbtn = createImg('balloon.png');
  blowerbtn.position(420, 300);
  blowerbtn.size(100,100);
  blowerbtn.mouseClicked(airblow);

  ground = new Ground(width/2, height-10, width, 20);

  bunny = createSprite(width/2,height-65, 20, 100);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");


  rope = new Rope(6, {x:220, y:30});
  rope_2 = new Rope(6, {x:800, y:30});
  rope_3 = new Rope(5, {x:500, y:30});

  fruit = Bodies.circle(300, 350, 20);
  Matter.Composite.add(rope.body, fruit);
  fruit_con = new Link(rope, fruit);

  Matter.Composite.add(rope_2.body, fruit);
  fruit_con_2 = new Link(rope_2, fruit);

  Matter.Composite.add(rope_3.body, fruit);
  fruit_con_3 = new Link(rope_3, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

}

function draw() {
  background(51);
  image(bg_img,0,0,width,height);

  push();
  imageMode(CENTER);
  if(fruit!= null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  Engine.update(engine);

  ground.show();
  rope.show();
  rope_2.show();
  rope_3.show();

  if(collide(fruit, bunny)== true){
    bunny.changeAnimation('eating');
    eatingsound.play();

  }

  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation('crying');
    sadsound.play();
    bgsound.stop();
    fruit = null
  }

  if(collide(fruit, star, 20) == true){
    star.visible = false;
    star_display.changeAnimation('one');
  } 

  if(collide(fruit, star,40)== true){
    star2.visible= false;
    star_display.changeAnimation('two');
  }

  drawSprites();

  
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutsound.play();
}

function drop_2(){
  rope_2.break();
  fruit_con_2.detach();
  fruit_con_2 = null;
  cutsound.play();
}

function drop_3(){
  rope_3.break();
  fruit_con_3.detach();
  fruit_con_3 = null;
  cutsound.play();
}


function collide(body, sprite)
{
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d <= 80){
      World.remove(world, fruit);
      fruit = null
      return true

    } else{
      return false
    }
  }
}

function mute(){
  if(bgsound.isPlaying()){
    bgsound.stop();
  } else{
    bgsound.play();
  }

}

function airblow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0, y:-0.01});
  airsound.play();
}
