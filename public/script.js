let word;
let definition = "";
let canvasSize = {
    x: window.innerWidth -2,
    y: window.innerHeight -100
}
let rewardsGiven =[];
let realPerson = false;
let denied = false;

const socket = io();
socket.on('verification', function(msg) {
    console.log(msg);
    if(msg.message==="denied"){
        denied=true;
    }
    if(msg.message==="approved"){
        realPerson=true;
    }
});

function setup() {
    canvas = createCanvas(canvasSize.x,canvasSize.y);
    input = createInput();
    input.type ='text';
    input.size(600);
    input.rows = 5;
    
    openButton = createButton("this is how i feel i guess");
    openButton.mousePressed(feelCheck);
    textFont(tangerine)
    textSize(44)
}
  
function draw() {
    background(244,203,255);
    text(definition,10,height/2, width-10, height);
    if(!realPerson && !denied){
        push()
        fill(0)
        text("PROVE YOU ARE HUMAN BY TELLING ME HOW YOU FEEL ABOUT YOUR DAD",10,canvasSize.y-canvasSize.y/2,canvasSize.x, canvasSize.y)
        pop() 
    }
    if(realPerson){
        push()
        fill(random(220),random(220),random(220))
        text("YEAH YOU ARE A HUMAN I'M SORRY",10,canvasSize.y-canvasSize.y/2,canvasSize.x, canvasSize.y)
        pop()
    }
    if(denied){
        push()
        fill(random(220),random(220),random(220))
        text("CONGRATULATIONS YOU ARE NOT HUMAN",10,canvasSize.y-canvasSize.y/2,canvasSize.x, canvasSize.y)
        pop()
    }
}

function preload() {
    tangerine = loadFont('/fonts/Tangerine-Regular.ttf');
}

const feelCheck = () => {
    const feel = input.value();
    console.log(feel);
    input.value('');
    sendFeeling(feel);
    // .then((json)=>{
    //     console.log(json)
    // })
    // .catch(error=>error)

}

const sendFeeling = (feel) => {

    let payload = {
        message: feel
    };
    socket.emit('feeling', {message:feel});

    let data = new FormData();
    data.append( "json", JSON.stringify( payload ) );
    console.log(data);
    console.log(JSON.stringify(payload))
    return fetch('http://prototypes.alden.website:8787/sendtext/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function(res){ console.log(res) })
    .catch(function(res){ console.log(res) })
 }