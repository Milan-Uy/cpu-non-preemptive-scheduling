
const at = document.getElementById('at-content');
const bt = document.getElementById('bt-content');
const pt = document.getElementById('pt-content');
const d = document.getElementById('d-content');
const waitTime = document.getElementById('wait-time');
const turnTime = document.getElementById('turn-time');
const aveW = document.getElementById('wait-ave');
const aveT = document.getElementById('turn-ave');
let p = 0;
let logic = '';
let atArray = [];
let btArray = [];
let ptArray = [];
let dArray = [];
let awt = 0;
let att = 0;
function setP(e) {
p = parseInt(e.target.innerHTML);
console.log(p);
createPinput(p);
}

function createPinput(counter){
   at.innerHTML = '';
   bt.innerHTML = '';
   pt.innerHTML = '';
   d.innerHTML = '';

  for(var x = 0; x< counter; x++){
   var div = document.createElement('div');
    div.className = 'form-control'
    div.innerHTML = `
                  <label for="">AT${x+1}:</label>
                  <input class="at-input" type="number">`
    at.appendChild(div);
   var div2 =  document.createElement('div');
    div2.className = 'form-control'
    div2.innerHTML = `
                  <label for="">BT${x+1}:</label>
                  <input class="bt-input" type="number">`
    bt.appendChild(div2);
    var div3 =  document.createElement('div');
    div3.className = 'form-control'
    div3.innerHTML = `
                  <label for="">Prio${x+1}:</label>
                  <input class="pt-input" type="number">`
    pt.appendChild(div3);
    var div4 =  document.createElement('div');
    div4.className = 'form-control'
    div4.innerHTML = `
                  <label for="">P${x+1}:</label>
                  <input class="pt-input" type="number">`
    d.appendChild(div4);
  }
    var div5 =  document.createElement('div');
  div5.className = 'form-control'
  div5.innerHTML = `
                <label for="">Number of Output:</label>
                <input class="pt-output" type="number">`
  d.appendChild(div5);
 
}

function selectedLogic(e){
  
  logic = e.target.innerHTML;
  console.log(logic);

  doLogic(logic,atArray,btArray,ptArray);
}

function selectedwithOptions(opt){
  console.log(atArray)
  console.log(btArray)
  console.log(ptArray)
  doLogic(opt,atArray,btArray,ptArray);
}

// doLogic('FCFS',[4,6,0,6,5],[5,4,3,2,4])
// doLogic('SJF',[6,8,7,3],[6,8,7,3])
// doLogic('Prio', [0,1,2,3,4],[4,3,1,5,2],[2,3,4,5,5])
function doLogic(logic,arr1, arr2,arr3){
  let currTime = 0;
  let obj = [];
  let newObj = [];
  for(var i = 0; i <arr1.length; i++){
    obj.push({
      pId: i+1,
      arrivalTime: arr1[i],
      burstTime: arr2[i],
      priority: 0,
      turnTime: 0,
      waitTime: 0
    })
  }
  let atA = JSON.parse(JSON.stringify(arr1));
  let btA = JSON.parse(JSON.stringify(arr2));
  let ptA = JSON.parse(JSON.stringify(arr3));
  var temp;
  // construct object
  switch(logic){
    case 'FCFS':
    while(obj.length!=0){
      var currP = Math.min(...atA);
      var currIndex = obj.findIndex(o=>o.arrivalTime === currP);
      if(currTime < currP){
        currTime = currP;
      }else{
        console.log(currP)
        obj[currIndex].turnTime = (currTime + obj[currIndex].burstTime) - obj[currIndex].arrivalTime;
        obj[currIndex].waitTime = obj[currIndex].turnTime - obj[currIndex].burstTime;
        currTime+=obj[currIndex].burstTime;
         temp = obj.splice(currIndex,1);
        atA.splice(currIndex,1);
        newObj.push(...temp);
      }
    }
   
      break;
    case 'SJF':
      obj.forEach(o=>{
        o.arrivalTime = 0;
      })
      while(obj.length!=0){
        var currP = Math.min(...btA);
        var currIndex = obj.findIndex(o=>o.burstTime === currP);
          console.log(currTime + obj[currIndex].burstTime);
          obj[currIndex].turnTime = (currTime + obj[currIndex].burstTime) - obj[currIndex].arrivalTime;
          obj[currIndex].waitTime = obj[currIndex].turnTime - obj[currIndex].burstTime;
          currTime+=obj[currIndex].burstTime;
          temp = obj.splice(currIndex,1);
          btA.splice(currIndex,1);
          newObj.push(...temp);
      }
      break;  
    case 'Prio':
      for(var i = 0; i <arr1.length; i++){
        obj[i].priority = arr3[i]
      }
      currTime = Math.min(...atA);
      while(obj.length!=0){
          var currP = obj.find(r=>r.priority ===  Math.max(...(obj.filter(o=>o.arrivalTime<=currTime).map(q=>q.priority)))).pId;
          var currIndex = obj.findIndex(o=>o.pId === currP);
          if(currTime < obj[currIndex].arrivalTime){
             currTime = obj[currIndex].arrivalTime;
          }else{
          obj[currIndex].turnTime = (currTime + obj[currIndex].burstTime) - obj[currIndex].arrivalTime;
          obj[currIndex].waitTime = obj[currIndex].turnTime - obj[currIndex].burstTime;
          currTime+=obj[currIndex].burstTime;
          temp = obj.splice(currIndex,1);
          // console.log(temp);
          newObj.push(...temp);
          }
      }
      break;
    case 'Deadline':
       
      break;  
  }
   // averages
      awt = newObj.reduce((r,c)=> r + c.waitTime,0)/newObj.length;
      att =  newObj.reduce((r,c)=> r + c.turnTime, 0)/newObj.length;
      newObj = newObj.sort((a,b)=>{
        return a.pId-b.pId
      })
  console.log(newObj);
  console.log(awt);
  console.log(att);
  createOutput(newObj,awt,att);

}

function createOutput(newObj,awt,att){
  aveW.innerHTML = awt;
  aveT.innerHTML = att;
  waitTime.innerHTML = '';
  turnTime.innerHTML = '';
  for(var x = 0; x< newObj.length; x++){
   var par = document.createElement('p');
    par.className = 'output-form'
    par.innerHTML = `P${x+1}: ${newObj[x].waitTime}`
    waitTime.appendChild(par);
    var par2 = document.createElement('p');
  par2.className = 'output-form'
  par2.innerHTML = `P${x+1}: ${newObj[x].turnTime}`
  turnTime.appendChild(par2);

  }
}

document.querySelectorAll('.selectP').forEach(item=>{
  item.addEventListener('click',setP);
})

document.querySelectorAll('.selectLogic').forEach(item=>{
  item.addEventListener('click',(e)=>{
    selectedLogic(e);
  });
})



// @ts-ignore
document.querySelector('#at-values').addEventListener('click',(e)=>{
  var els = document.querySelectorAll('.at-input');
  atArray = [].map.call(els, el => parseInt(el.value));
})

// @ts-ignore
document.querySelector('#bt-values').addEventListener('click',(e)=>{
  var els = document.querySelectorAll('.bt-input');
  btArray = [].map.call(els, el => parseInt(el.value));
})

// @ts-ignore
document.querySelector('#pt-values').addEventListener('click',(e)=>{
  var els = document.querySelectorAll('.pt-input');
  ptArray = [].map.call(els, el => parseInt(el.value));
   selectedwithOptions('Prio');
})
let dout = 0;
// @ts-ignore
document.querySelector('#d-values').addEventListener('click',(e)=>{
  var els = document.querySelectorAll('.d-input');
  ptArray = [].map.call(els, el => parseInt(el.value));
   selectedwithOptions('Deadline');
    var d = document.getElementById('d-output')["value"];
    dout = d;
})




















