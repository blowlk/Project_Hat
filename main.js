const prompt = require('prompt-sync')({sigint: true});


const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const moves = ['U','D','L','R']
const altMoves = ['A','S','D','W']

class Field {
    constructor(field= [[]],mode='normal',moveType=1){
      this._field = field
      this._mode = mode
      this._moveType = moveType
    }
  
  static print(field){
      console.clear()
      for(let i=0;i<field.length;i++)
      { 
        console.log(field[i].join(''))
        
     }
   }
  
  static generateField(x,y,prc){
    //
    let newField =[]
    let hatX = 0;
    let hatY = 0;
    // generate player position
    const playerX = Math.floor(Math.random()*x);
    const playerY = Math.floor(Math.random()*y);
    // generate hat position
    while (true)
    { hatX = Math.floor(Math.random()*x);
      hatY = Math.floor(Math.random()*y);
      if (hatX != playerX || hatY != playerY){
        break;
      }
    };
    // generate field
    for(let i=0;i<x;i++)
    {
      newField.push([]);
      
      for(let j=0;j<y;j++)
      {
       if (playerX==i&&playerY==j){
        newField[i].push(hat)
      }
       else{
        if(hatX==i&&hatY==j){  
        newField[i].push(pathCharacter)}
        else{newField[i].push(fieldCharacter)}
       }
        
       }
    }
    // generate holes
    const holesCount = Math.floor(x*y*prc/100);
    
    for(let i=0;i<holesCount;i++){
      while (true)
      { let holeX = Math.floor(Math.random()*x);
        let holeY = Math.floor(Math.random()*y);
        if (newField[holeX][holeY] == fieldCharacter)
        {
          newField[holeX][holeY]=hole;
          break;
        }
      };
    }
    return newField;
  }

  addHoles(holesCount){
    //check if free place available
    let clearCount = 0;
    for(let i=0;i<this._field.length;i++){
      for(let j=0;j<this._field[i].length;j++){
        if (this._field[i][j]==fieldCharacter){
          clearCount++;
        }
      }
    }
    //add holes
    for(let i=0;i<Math.min(holesCount,clearCount);i++){
      while (true)
      { let holeX = Math.floor(Math.random()*this._field.length);
        let holeY = Math.floor(Math.random()*this._field[holeX].length);
        if (this._field[holeX][holeY] == fieldCharacter)
        {
          this._field[holeX][holeY]=hole;
          break;
        }
      };
    }
  }

  static isFieldSolvable(checkField,printProgress=false){
    let playerX;
    let playerY;
    let hatX;
    let hatY;
    let fieldCount = 0;
    let checkPath = true, hardWay = false;
    let inpField = checkField.map(function(arr) {return arr.slice();});
    //let moveDirection = 1;
    let descisionPoint =[];
    let tmp1,tmp2,tmp3,tmp4,tmpDir=0;
    // get field positions
    for(let i=0;i<inpField.length;i++){
      for(let j=0;j<inpField[i].length;j++){
        if (inpField[i][j]==pathCharacter){
          playerX=i;playerY=j;
        }
        if (inpField[i][j]==hat){
          hatX=i;hatY=j;
        }
        if (inpField[i][j]==fieldCharacter){
          fieldCount += 1;
        }
      }
    }
    //
    if(printProgress){Field.print(inpField)};
    descisionPoint.push([playerX,playerY]);
    //
    let step;
    while (checkPath){
      if(printProgress){let key = prompt('Proceed? '/*\n'+'player:x'+playerX+';player:y'+playerY+'\n'+'hatx:'+hatX+';haty:'+hatY*/)};
      step = 0;
      //check available side
      try{if(inpField[playerX-1][playerY]==fieldCharacter){tmp1=Math.abs(playerX-1-hatX)+Math.abs(playerY-hatY)};} catch(err){}
      try{if(inpField[playerX+1][playerY]==fieldCharacter){tmp2=Math.abs(playerX+1-hatX)+Math.abs(playerY-hatY)};} catch(err){}
      try{if(inpField[playerX][playerY-1]==fieldCharacter){tmp3=Math.abs(playerX-hatX)+Math.abs(playerY-1-hatY)};} catch(err){}
      try{if(inpField[playerX][playerY+1]==fieldCharacter){tmp4=Math.abs(playerX-hatX)+Math.abs(playerY+1-hatY)};} catch(err){}
      // check if the end is near :)
      if((isNaN(tmp1) ? 0 : tmp1)==1){inpField[playerX-1][playerY]=pathCharacter;if(printProgress){Field.print(inpField)};return true;}
      if((isNaN(tmp2) ? 0 : tmp2)==1){inpField[playerX+1][playerY]=pathCharacter;if(printProgress){Field.print(inpField)};return true;}
      if((isNaN(tmp3) ? 0 : tmp3)==1){inpField[playerX][playerY-1]=pathCharacter;if(printProgress){Field.print(inpField)};return true;}
      if((isNaN(tmp4) ? 0 : tmp4)==1){inpField[playerX][playerY+1]=pathCharacter;if(printProgress){Field.print(inpField)};return true;}
      // remember other choices
      if ((isNaN(tmp1) ? 0 : tmp1)==(isNaN(tmp2) ? Infinity : tmp2)){
        descisionPoint.push([playerX+1,playerY])
      };
      if ((isNaN(tmp1) ? 0 : tmp1)==(isNaN(tmp3) ? Infinity : tmp3)
        ||(isNaN(tmp2) ? 0 : tmp2)==(isNaN(tmp3) ? Infinity : tmp3)
          ){
        descisionPoint.push([playerX,playerY-1])
      };
      if ((isNaN(tmp1) ? 0 : tmp1)==(isNaN(tmp4) ? Infinity : tmp4)
        ||(isNaN(tmp2) ? 0 : tmp2)==(isNaN(tmp4) ? Infinity : tmp4)
        ||(isNaN(tmp3) ? 0 : tmp3)==(isNaN(tmp4) ? Infinity : tmp4)
          )
      {
        descisionPoint.push([playerX,playerY+1])
      };
      // check wich way to choose
      switch (Math.min(isNaN(tmp1) ? Infinity : tmp1
      ,isNaN(tmp2) ? Infinity : tmp2
      ,isNaN(tmp3) ? Infinity : tmp3
      ,isNaN(tmp4) ? Infinity : tmp4
      ))
      {
        case (isNaN(tmp1) ? 0 : tmp1):playerX -=1; step = 1; break;
        case (isNaN(tmp2) ? 0 : tmp2):playerX +=1; step = 1; break;
        case (isNaN(tmp3) ? 0 : tmp3):playerY -=1; step = 1; break;
        case (isNaN(tmp4) ? 0 : tmp4):playerY +=1; step = 1; break;
      }
      tmp1=undefined;
      tmp2=undefined;
      tmp3=undefined;
      tmp4=undefined;
      if (step == 1){
        //moveDirection = 1
        if (inpField[playerX][playerY]==fieldCharacter)
        {
          fieldCount-=1
          if(fieldCount == 0){return false}
        }
      }
      else{
        { 
          //check if other descision point exists
          if (descisionPoint.length>0)
          {
            if(hardWay){hardWay=false}
            playerX = descisionPoint[descisionPoint.length-1][0]
            playerY = descisionPoint[descisionPoint.length-1][1]
            descisionPoint.pop()
          }
          else 
          {
            if (hardWay) {return false} else {hardWay = true}
          }
        }
        if(hardWay)
        {
          // read field and already passed path, get available turns
          for(let i=0;i<inpField.length;i++){
            for(let j=0;j<inpField[i].length;j++){
              if (inpField[i][j]==pathCharacter)
              {
                let maxTempX = Math.max(i-1,0);
                let minTempX = Math.min(i+1,inpField.length-1);
                let maxTempY = Math.max(j-1,0);
                let minTempY = Math.min(j+1,inpField[i].length-1);
                if(inpField[maxTempX][j]==fieldCharacter
                 ||inpField[minTempX][j]==fieldCharacter
                 ||inpField[i][maxTempY]==fieldCharacter
                 ||inpField[i][minTempY]==fieldCharacter
                  ){descisionPoint.push([i,j])
                  };break;
              }
              if (inpField[i][j]==fieldCharacter){
                fieldCount += 1;
              }
            }
          }
        }
      }
      inpField[playerX][playerY]=pathCharacter
      if(printProgress){Field.print(inpField)};
      
    }
  }

playGame()
{
  let endGame = false;
  let x=0, y=0;
  let key;
  // get player position
  for(let i=0;i<this._field.length;i++){
    for(let j=0;j<this._field[i].length;j++){
      if (this._field[i][j]==pathCharacter){
        x=i;y=j;break;
      }
    }
  }
  // get maximum length
  let maxX = this._field.length;
  // start game
  while (!endGame)
  {
    let proceed=false;
    let wrongKey=false;
    while (!proceed)
    { 
      Field.print(this._field);
      let promptText;
      if(this._moveType==1){
        if(!wrongKey){promptText = 'Which way? (l-left, r-right, u-up, d-down): '}
        else{promptText = 'Wrong Key, Please Use "L" for left, "R" for right, "U" for up and "D" for down:'}
      };
      if(this._moveType==2){
        if(!wrongKey){promptText = 'Which way? (a-left, d-right, w-up, s-down): '}
        else{promptText = 'Wrong Key, Please Use "A" for left, "D" for right, "W" for up and "S" for down:'}
      };
      //
      key = prompt(promptText);
      //
      key = key.toUpperCase();
      //
      if (key=="/")
      {
        if(Field.isFieldSolvable(generatedField,true))
        {
          proceed=false;
          endGame=true;
          break;
        }
      }
      //
      // check key
      if (this._moveType ==1 && !(moves.includes(key)) || this._moveType == 2 && !(altMoves.includes(key)))
      {
        wrongKey=true;
        proceed=false;
        continue;
      }
      else
      {
        wrongKey=false;
        proceed=true;
      }
    }
    // make move
    let maxY = this._field[x].length;
      try{
        if (this._moveType==1){
            switch (key)
            {
              case "D" :
                  if(x+1>=maxX){console.log('Sorry, you lost, out of bounds');endGame=true}
                  else{x+=1}
                break;
              case "U" :
                if(x-1<0){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{x-=1;}
                break;
              case "L" :
                if(y-1<0){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{y-=1}
                break;
              case "R" :
                if(y+1>=maxY){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{y+=1}
                break;
            };
          }
          if (this._moveType==2){
            switch (key)
            {
              case "S" :
                  if(x+1>=maxX){console.log('Sorry, you lost, out of bounds');endGame=true}
                  else{x+=1}
                break;
              case "W" :
                if(x-1<0){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{x-=1;}
                break;
              case "A" :
                if(y-1<0){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{y-=1}
                break;
              case "D" :
                if(y+1>=maxY){console.log('Sorry, you lost, out of bounds');endGame=true}
                else{y+=1}
                break;
            };
          }
          if (this._field[x][y] == hole){console.log('Sorry, you fell down into a hole');endGame=true}
          if (this._field[x][y] == hat){console.log('Congratulation!!! You found your hat!!!');endGame=true}
          this._field[x][y]=pathCharacter;
          if(this._mode = 'HARD'){this.addHoles(2)}
      }
      catch(err){console.log(err);break;}
      }
    }
}
  
// generate field and check if solvable with current settings
let generatedField =[[]];
let startGame = false;
for(i=0;i<100;i++)
{
  generatedField = Field.generateField(15,25,20)
  if(Field.isFieldSolvable(generatedField)){startGame=true;break}
}
// start game
if(startGame)
{
  const myField = new Field(generatedField,"HARD",2);
  myField.playGame();
}
else
{
  console.log('Please choose another parameters for field generation!')
}
  
  
