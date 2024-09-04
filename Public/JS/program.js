var marker="O";
var timeUp=60;
var chances = 0;
var gameOver=false;

var section1=["r1c1","r1c4","r1c7","r4c1","r4c4","r4c7","r7c1","r7c4","r7c7"];
var section2=["r1c2","r1c5","r1c8","r4c2","r4c5","r4c8","r7c2","r7c5","r7c8"];
var section3=["r1c3","r1c6","r1c9","r4c3","r4c6","r4c9","r7c3","r7c6","r7c9"];
var section4=["r2c1","r2c4","r2c7","r5c1","r5c4","r5c7","r8c1","r8c4","r8c7"];
var section5=["r2c2","r2c5","r2c8","r5c2","r5c5","r5c8","r8c2","r8c5","r8c8"];
var section6=["r2c3","r2c6","r2c9","r5c3","r5c6","r5c9","r8c3","r8c6","r8c9"];
var section7=["r3c1","r3c4","r3c7","r6c1","r6c4","r6c7","r9c1","r9c4","r9c7"];
var section8=["r3c2","r3c5","r3c8","r6c2","r6c5","r6c8","r9c2","r9c5","r9c8"];
var section9=["r3c3","r3c6","r3c9","r6c3","r6c6","r6c9","r9c3","r9c6","r9c9"];

var checkbox1=["r1c1","r1c2","r1c3","r2c1","r2c2","r2c3","r3c1","r3c2","r3c3"];
var checkbox2=["r1c4","r1c5","r1c6","r2c4","r2c5","r2c6","r3c4","r3c5","r3c6"];
var checkbox3=["r1c7","r1c8","r1c9","r2c7","r2c8","r2c9","r3c7","r3c8","r3c9"];
var checkbox4=["r4c1","r4c2","r4c3","r5c1","r5c2","r5c3","r6c1","r6c2","r6c3"];
var checkbox5=["r4c4","r4c5","r4c6","r5c4","r5c5","r5c6","r6c4","r6c5","r6c6"];
var checkbox6=["r4c7","r4c8","r4c9","r5c7","r5c8","r5c9","r6c7","r6c8","r6c9"];
var checkbox7=["r7c1","r7c2","r7c3","r8c1","r8c2","r8c3","r9c1","r9c2","r9c3"];
var checkbox8=["r7c4","r7c5","r7c6","r8c4","r8c5","r8c6","r9c4","r9c5","r9c6"];
var checkbox9=["r7c7","r7c8","r7c9","r8c7","r8c8","r8c9","r9c7","r9c8","r9c9"];

document.addEventListener("DOMContentLoaded", () => {
    setPlayerNames();
    allButtonActivation();
    timer();
});

function allButtonActivation(){
    for(i=1;i<10;i++){
        if(window[`checkbox${i}`].length==0){
            continue;
        }
        window[`checkbox${i}`].forEach(element => {
            document.getElementById(element).addEventListener('click',buttonClick);
        });
    }
}


function buttonClick(event){
    if(chances!=0){
        allButtonActivation();
    }
    buttonId = event.target.id;
    buttonPress(buttonId);
    
    //Checking Inner Winner
    for(i=1;i<10;i++){
        if(window[`checkbox${i}`].includes(buttonId)){
            innerWinner(i);
        }
    }

    //Checking Outer Winner
    outerWinner();

    if((chances++)%2==0){
        timeUp=60;
        playerAlternateTo2();
    }else{
        timeUp=60;
        playerAlternateTo1();
    }
    logic(buttonId);
}

function buttonPress(id){
    if(document.getElementById(id).innerHTML=="Null"){
        document.getElementById(id).innerHTML=marker;
    }else{
        alert("Already Occupied");
    }
}

function playerAlternateTo1(){
    document.getElementById("player1").innerHTML="Play";
    document.getElementById("player2").innerHTML="Waiting ...";
    marker="O";
}

function playerAlternateTo2(){
    document.getElementById("player2").innerHTML="Play";
    document.getElementById("player1").innerHTML="Waiting ...";
    marker="X";
}

function logic(buttonId) {
    const sections = [
      section1, section2, section3, section4,
      section5, section6, section7, section8, section9
    ];
    
    sections.forEach((section, index) => {
      if (section.includes(buttonId)) {
        sectionHandler(index + 1);
      }
    });
}
  
function sectionHandler(sectionNumber) {
    opacityAdjuster(sectionNumber);
    if(window[`checkbox${sectionNumber}`].length==0){
        universalInput();
    }else{
        for (let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                try{
                    var cellId = `r${i}c${j}`;
                    document.getElementById("playCheckbox").innerHTML=`Play in CheckBox ${sectionNumber}`; 
                    if (!window[`checkbox${sectionNumber}`].includes(cellId)) {
                        document.getElementById(cellId).removeEventListener("click", buttonClick);
                }
                }catch(err){}
            }
        }
    }
}

function universalInput(){
    removeButtonsID();
    allButtonActivation();
    document.getElementById("playCheckbox").innerHTML=`Play in Any Checkbox`;
}

function removeButtonsID(){
    for (i=1;i<10;i++){
        if (document.getElementById(`w${i}`)!=null){
            window[`checkbox${i}`].length=0;
        };
    }
}

async function setPlayerNames(){
    const res = await fetch("db.txt");
    const names = await res.text();
    const namesOBJ = JSON.parse(names);
    document.getElementById("player1Name").innerHTML = namesOBJ.name1;
    document.getElementById("player2Name").innerHTML = namesOBJ.name2;
}

async function timer(){
    await new Promise((resolve) => {
        const clearId=setInterval(()=>{
            if (gameOver==false){
                document.getElementById("time").innerHTML=`Time left : ${timeUp--} Sec`;
            }
            if(timeUp<0){
                clearInterval(clearId);
                if((chances++)%2==0){
                    timeUp=60;
                    playerAlternateTo2();
                }else{
                    timeUp=60;
                    playerAlternateTo1();
                }
                resolve();
            }
            },1000);
    });
    timer();
}

function innerWinner(checkBoxNo){
    if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][1]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][3]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][5]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][7]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][3]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][1]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][7]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][5]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="X" && document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="X"){
        declareInnerWinner(checkBoxNo,"X");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][1]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][3]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][5]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][7]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][3]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][1]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][7]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][5]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][0]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][8]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else if(document.getElementById(window[`checkbox${checkBoxNo}`][2]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][4]).innerHTML=="O" && document.getElementById(window[`checkbox${checkBoxNo}`][6]).innerHTML=="O"){
        declareInnerWinner(checkBoxNo,"O");
    }else{
        const allFilled = window[`checkbox${checkBoxNo}`].every(element => {
            return document.getElementById(element).innerHTML !== "Null";
        });
        if (allFilled) {
            declareInnerWinner(checkBoxNo,"D");
        }
    }
}

function declareInnerWinner(checkBoxNo,sign){
    document.getElementById(`checkbox${checkBoxNo}`).outerHTML=`<button id=\"w${checkBoxNo}\">${sign}</button>`;
    window[`checkbox${checkBoxNo}`].length=0;
}

function outerWinner(){
    try{
        if(document.getElementById(`w1`).innerHTML=="X" && document.getElementById(`w2`).innerHTML=="X" && document.getElementById(`w3`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}
    
    try{
        if(document.getElementById(`w4`).innerHTML=="X" && document.getElementById(`w5`).innerHTML=="X" && document.getElementById(`w6`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w7`).innerHTML=="X" && document.getElementById(`w8`).innerHTML=="X" && document.getElementById(`w9`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w1`).innerHTML=="X" && document.getElementById(`w4`).innerHTML=="X" && document.getElementById(`w7`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w2`).innerHTML=="X" && document.getElementById(`w5`).innerHTML=="X" && document.getElementById(`w8`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w3`).innerHTML=="X" && document.getElementById(`w6`).innerHTML=="X" && document.getElementById(`w9`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w1`).innerHTML=="X" && document.getElementById(`w5`).innerHTML=="X" && document.getElementById(`w9`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w3`).innerHTML=="X" && document.getElementById(`w5`).innerHTML=="X" && document.getElementById(`w7`).innerHTML=="X"){
            declareOuterWinner("X");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w1`).innerHTML=="O" && document.getElementById(`w2`).innerHTML=="O" && document.getElementById(`w3`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w4`).innerHTML=="O" && document.getElementById(`w5`).innerHTML=="O" && document.getElementById(`w6`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w7`).innerHTML=="O" && document.getElementById(`w8`).innerHTML=="O" && document.getElementById(`w9`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w1`).innerHTML=="O" && document.getElementById(`w4`).innerHTML=="O" && document.getElementById(`w7`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w2`).innerHTML=="O" && document.getElementById(`w5`).innerHTML=="O" && document.getElementById(`w8`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w3`).innerHTML=="O" && document.getElementById(`w6`).innerHTML=="O" && document.getElementById(`w9`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w1`).innerHTML=="O" && document.getElementById(`w5`).innerHTML=="O" && document.getElementById(`w9`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        if(document.getElementById(`w3`).innerHTML=="O" && document.getElementById(`w5`).innerHTML=="O" && document.getElementById(`w7`).innerHTML=="O"){
            declareOuterWinner("O");
        }
    }catch(err){}

    try{
        check=document.getElementById(`w1`);
        check=document.getElementById(`w2`);
        check=document.getElementById(`w3`);
        check=document.getElementById(`w4`);
        check=document.getElementById(`w5`);
        check=document.getElementById(`w6`);
        check=document.getElementById(`w7`);
        check=document.getElementById(`w8`);
        check=document.getElementById(`w9`);
        declareInnerWinner("D")
    }catch(err){}
}

function declareOuterWinner(sign){
    if(sign=="X"){
        document.getElementById("winner").innerHTML="The Winner is (X) : "+document.getElementById("player2Name").innerHTML;
        document.getElementById("playground").style.display="none";
        gameOver=true;

    }else if(sign=="O"){
        document.getElementById("winner").innerHTML="The Winner is (O) : "+document.getElementById("player1Name").innerHTML;
        document.getElementById("playground").style.display="none";
        gameOver=true;

    }else if(sign="D"){
        document.getElementById("winner").innerHTML="Oh No it was a Draw";
        document.getElementById("playground").style.display="none";
        gameOver=true;
    }
}

function opacityAdjuster(sectionNo){
    for(i=1;i<10;i++){
        try {
            if(i==sectionNo){
                document.getElementById(`checkbox${sectionNo}`).style.borderStyle="solid";
                document.getElementById(`checkbox${sectionNo}`).style.borderColor="red";
                document.getElementById(`checkbox${sectionNo}`).style.borderWidth="2px";
            }else{
                document.getElementById(`checkbox${i}`).style.borderStyle="none";
    
            }
        }catch(err){}
    }
}