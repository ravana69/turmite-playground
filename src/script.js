window.addEventListener('resize', resize, false);

var cellSize = 5;

var rule = [];
var colors = [];
var dirs = [
  [0, -1], [1, 0], [0, 1], [-1, 0]
];

var steps = 0;
var speed = 50;

var grid = [];
var gridWidth, gridHeight;
var ant = new Ant(0, 0);

var running = true;

var modal = document.getElementById('myModal');
var btn = document.getElementById("modalBtn");
var span = document.getElementsByClassName("close")[0];
var rowSlider = document.getElementById("rowSlider");
var colSlider = document.getElementById("colSlider");
var rowText = document.getElementById("rowText");
var colText = document.getElementById("colText");
var ruleTable = document.getElementById("ruleTable");
var runBtn = document.getElementById("run");
var resetBtn = document.getElementById("reset");
var randomBtn = document.getElementById("random");
var speedSlider = document.getElementById("speedSlider");
var speedText = document.getElementById("speedText");
var gridSlider = document.getElementById("gridSlider");
var gridText = document.getElementById("gridText");
btn.onclick = function() {modal.style.display = "block";}
span.onclick = function() {modal.style.display = "none";}
rowSlider.oninput = function(){createTable()};
colSlider.oninput = function(){createTable()};
runBtn.onclick = function(){toggleRunning()};
resetBtn.onclick = function(){reset()};
randomBtn.onclick = function(){randomize()};
speedSlider.oninput = function(){
  speed = speedSlider.value;
  speedText.innerHTML = speed;
}

gridSlider.oninput = function(){
  if (running) toggleRunning();
  cellSize = gridSlider.value;
  gridText.innerHTML = cellSize;
  resize();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

function createTable(){
  var rows = rowSlider.value;
  var cols = colSlider.value;
  rowText.innerHTML = rows;
  colText.innerHTML = cols;
  
  var text = "";
  for (var i = 0; i < cols; i++){
    text += "<tr>";
    for (var j = 0; j < rows; j++){
      text += "<td><input type='text' class='ruleInput' oninput='updateRule()'/></td>";
    }
    text += "</tr>";
  }
  ruleTable.innerHTML = text;
  
  updateRule();
}

function updateRule(){
  if (running){
    toggleRunning();
  }
  reset();
  
  rule = [];

  for (var i = 0; i < ruleTable.rows[0].cells.length; i++) {
    rule.push([]);
    for (var j = 0; j < ruleTable.rows.length; j++) {
      rule[i].push(parseRule(ruleTable.rows[j].cells[i].children[0].value));
    }
  }
  
  console.log(rule);
  
  createColors();
  if (!running) toggleRunning();
}

function parseRule(text){
  var split = text.replace(/\s/g,'').split(',');
  var ruleset = [];
  for (var i = 0; i < min(3, split.length); i++){
    var value = parseInt(split[i]);
    if (isNaN(value) || value < 0) value = -1;
    ruleset.push(value);
  }
  for (var i = ruleset.length; i < 3; i++){
    ruleset.push(-1);
  }
  ruleset[0] = min(ruleset[0], ruleTable.rows[0].cells.length-1);
  ruleset[1] = min(ruleset[1], 3);
  ruleset[2] = min(ruleset[2], ruleTable.rows.length - 1);
  return ruleset;
}

function createColors(){
  colors = [];
  var range = random()*180 + 45;
  var start = random()*360;
  
  var a = color(start, 100, 20);
  var b = color(start+range, 100, 100);
 
  colors.push(color(0));
  for (var i = 1; i < rule.length; i++){
    var amount = i/(rule.length - 1);
    colors.push(lerpColor(a, b, amount));
  }
}

function toggleRunning(){
  running = !running;
  if (running) runBtn.innerHTML = "pause";
  else runBtn.innerHTML = "run";
}

function reset(){
  background(0);
  createColors();
  for (var i = 0; i < gridWidth; i++){
    for (var j = 0; j < gridHeight; j++){
      grid[i][j] = 0;
    }
  }
  ant.x = floor(gridWidth/2);
  ant.y = floor(gridHeight/2);
  ant.prevX = ant.x;
  ant.prevY = ant.y;
  ant.heading = 0;
  ant.state = 0;
  
  steps = 0;
}

function randomize(){
  if (running){
    toggleRunning();
  }
  reset();
  
//   var coords = [];
  
//   for (var i = 0, row; row = ruleTable.rows[i]; i++){
//     for (var j = 0, col; col = row.cells[j]; j++) {
//       coords.push([i, floor(random()*4), j]);
//     }
//   }
  
//   shuffle(corrds);
  
  for (var i = 0, row; row = ruleTable.rows[i]; i++){
    for (var j = 0, col; col = row.cells[j]; j++) {
      var input = col.children[0];
      input.value = getRandomRuleSet();
    }
  }
  
  updateRule();
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

function getRandomRuleSet(){
  var ruleset = "";
  ruleset += floor(random()*ruleTable.rows[0].cells.length) + ", "
  ruleset += floor(random()*4) + ", "
  ruleset += floor(random()*ruleTable.rows.length);
  return ruleset;
}

function Ant(x, y){
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.state = 0;
  this.heading = 0; //0-N 1-E 2-W 3-S
  
  this.update = function(){
    if (this.heading > 3) this.heading -= 4;
    if (this.heading < 0) this.heading += 4;
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += dirs[this.heading][0];
    this.y += dirs[this.heading][1];
  }
  
  this.ooBounds = function(){
    return this.x < 0 || this.y < 0 || this.x >= gridWidth || this.y >= gridHeight ||
           this.prevX < 0 || this.prevY < 0 || this.prevX >= gridWidth || this.prevY >= gridHeight;
  }
}

function setup(){
  createCanvas();
  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);
  noStroke();
  resize();
}

function init(){
  background(0);
  grid = [];
  for (var i = 0; i < gridWidth; i++){
    grid.push([]);
    for (var j = 0; j < gridHeight; j++){
      grid[i].push(0);
    }
  }
  
  ant.x = floor(gridWidth/2);
  ant.y = floor(gridHeight/2);
  ant.prevX = ant.x;
  ant.prevY = ant.y;
  ant.heading = 0;
  ant.state = 0;
  updateRule();
}

function draw(){
  
  for (var i = 0; i < speed; i++){
    if (colors.length == 0 || rule.length == 0) return;
    if (ant.ooBounds()) return;

    fill(100);
    rect(ant.x*cellSize, ant.y*cellSize, cellSize, cellSize);

    if (running){
       if (ant.prevX != -1){
         var value = grid[ant.prevX][ant.prevY];
         fill(colors[value]);
         rect(ant.prevX*cellSize, ant.prevY*cellSize, cellSize, cellSize);
       }
      
      var curColor = grid[ant.x][ant.y];
      var lookup = rule[curColor][ant.state];
      
      if (lookup[0] != -1) grid[ant.x][ant.y] = lookup[0];
      if (lookup[1] != -1) ant.heading += lookup[1];
      if (lookup[2] != -1) ant.state = lookup[2];
      ant.update();
      
      steps++;
      fill(0);
      rect(0, height-30, 150, height);
      fill(100);
      text("steps: " + steps, 0, height-5);
    }
  }
}

function resize(){
  resizeCanvas(window.innerWidth, window.innerHeight);
  gridWidth = ceil(width/cellSize);
  gridHeight = ceil(height/cellSize);
  init();
}