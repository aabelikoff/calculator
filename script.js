//FUNCTIONS FOR ALL BASIC MATH OPERATORS
function add (a,b) {
    return a + b;
}

function substract (a,b) {
    return a - b;
}

function multiply (a,b) {
    return a * b;
}

function divide (a,b) {
    return b!==0 ? a / b : "Error";
}

function operate (a,operator,b) {
    switch (operator){
        case "+":
            return add(a,b);
        case "-":
            return substract(a,b);
        case '*':
            return multiply(a,b);
        case '/':
            return divide(a,b);
        case "^":
            return Math.pow(a,b);
        default:
            return 0;
    };
}

let expression = '';//keeps data from keys
//Object with data for calculation
let dataForCompute = {
    firstNumber: 0,
    secondNumber: 0,
    operator: 0,
    result: undefined,
    string: '',
   
    makeString: function (option){
        if (option === "full" && this.operator !== 0){
            this.string = `${this.firstNumber} ${this.operator} ${this.secondNumber} = `;
        }
        else if (option === 'part'){
            this.string = `${this.firstNumber} ${this.operator}`;
        }
    },

    clearData: function (){
        this.firstNumber = this.secondNumber =  this.operator = 0;
        this.result = undefined;
        this.string = '';
    },
};

//Add click events handler for number buttons
let numberButtons = Array.from(document.querySelectorAll('.num'));
numberButtons.forEach(elem => elem.addEventListener('click', pressNumber));

function pressNumber (e) {
    if (expression.length < 16) {
       if (e.type === 'click'){
            expression+= e.target.getAttribute('data-key');
       }
       else {
            expression+= e.key;
       }
        if (expression === '00') {
            expression = expression.slice(0,1);
        }
        if (expression.charAt(0)==='0' && expression.charAt(1)!== '.'){
            expression = expression.slice (1);
        }
    }
    if (dataForCompute.result !== undefined){ //if we want to enter a number after result calculation
        let s = expression;
        clearAll();
        expression = s;
    }
}

//Click event handler for point button. Enable float numbers
let pointButton = document.querySelector('.point');
pointButton.addEventListener ('click', pressPoint);

function pressPoint () {
    if(expression.indexOf('.') === -1 && expression.length > 0) {
        expression+='.';
    }
    else if (expression.length === 0) {
        expression='0.';
    }
    else if (expression.indexOf('.',1)){
        return;   
    }
}

//Displaying only 16 digits of result
function filterDigits (number, size){
    let str = `${number}`;
      if (str.length <= size ){
        return str;
    }
    else if (str.indexOf('e') === -1) {
       return str.slice (0,16);
    }
    else {
        let index = str.indexOf('e');
        let substrEnd = str.slice(index);
        let substrBeg = str.slice(0,index - (str.length - size)); 
        return substrBeg + substrEnd;
    }
}
//Click event handler for *,/,+,-,^ buttons
let operators = Array.from(document.querySelectorAll('button.oper'));
operators.forEach((elem)=> elem.addEventListener('click', pressOper));
function pressOper (e) {
    if (!isNaN(parseFloat(expression)) && !dataForCompute.operator && dataForCompute.result === undefined){
        dataForCompute.firstNumber =  parseFloat(expression);
        expression='';
    }
    else if (!isNaN(parseFloat(expression)) && dataForCompute.operator && dataForCompute.result === undefined){
        dataForCompute.secondNumber =  parseFloat(expression);
        expression='';
        dataForCompute.result = operate(dataForCompute.firstNumber, dataForCompute.operator, dataForCompute.secondNumber);
        dataForCompute.firstNumber = dataForCompute.result;
        dataForCompute.result = undefined;
    }
    else if (isNaN(parseFloat(expression)) && dataForCompute.operator && dataForCompute.result !== undefined){
        dataForCompute.firstNumber = dataForCompute.result === 'Error' ? 0 : dataForCompute.result; //if we have previous 'Error' 
        dataForCompute.result = undefined;
    }
    else if (isNaN(parseFloat(expression)) && !dataForCompute.operator && dataForCompute.result === undefined){
        dataForCompute.firstNumber = 0;
    }
    if (e.type === 'click'){
        dataForCompute.operator = e.target.getAttribute('data-key');
    }
    else {
        dataForCompute.operator = e.key;
    }
    dataForCompute.makeString('part');
}
//Event handler for '=' button
let compute = document.querySelector('.compute');
compute.addEventListener('click', calculate);

function calculate () {
    if (!isNaN(parseFloat(expression))) {
        if (dataForCompute.operator){
            dataForCompute.secondNumber = parseFloat(expression);
            expression = '';
        }
        else {
            return;
        }
    }
    else {
        if (dataForCompute.result === "Error"){
            clearAll();
            return;
        }
        else if (dataForCompute.operator && dataForCompute.result !== undefined) {
            dataForCompute.firstNumber = dataForCompute.result;
        }
        else if (!dataForCompute.operator && dataForCompute.result === undefined){
            return;
        }
    }
    dataForCompute.makeString('full');
    dataForCompute.result = (operate(dataForCompute.firstNumber, dataForCompute.operator, dataForCompute.secondNumber));///
}
//Clearing data
function clearAll() {
    dataForCompute.clearData();
    expression = '';  
}

let clear = document.querySelector('.clear');
clear.addEventListener('click',clearAll);

//Event handler for backspace button
let backSpace = document.querySelector('.backspace');
backSpace.addEventListener('click', cutLastSymbol);

function cutLastSymbol() {
    if (expression.length > 2){
        expression = expression.substring(0,expression.length-1);
    }
    else if (expression.length === 2) {
        expression = expression.charAt(0);
    }
    else {
        expression = '';
    }
}

//Event handler for changing +/- before number
let minus = document.querySelector('.minus');
minus.addEventListener('click', changePlusMinus);

function changePlusMinus (){
    if(expression.length>0 && expression.length <17 && expression.slice(0,1) !== '-'){
        expression = '-' + expression;
    }
    else if (expression.slice(0,1) === '-') {
        expression = expression.slice(1);
    }
}

//Event handler for keydown events
window.addEventListener ('keydown', (e) => {
    if (!isNaN(parseInt(e.key))){
        pressNumber(e);
        visualizeNumbers ()
    }
    else if (e.key === '.') {
        pressPoint();
        visualizeNumbers ()
    }
    else if (e.key === '/' ||
             e.key === '*' ||
             e.key === '-' ||
             e.key === '+' ||
             e.key === '^' ){
        pressOper(e);
        numbers.textContent = e.key;
        exp.textContent = dataForCompute.string;
    }
    else if (e.key === '=' || e.key === 'Enter'){
        calculate();
        visualizeCompute ();
    }
    else if (e.key === 'Backspace'){
        cutLastSymbol();
        visualizeBackspace ();
    }
    else if (e.key === 'Escape'){
        clearAll();
        visualizeClear ();
    }
    animateButtons(e);
});
//Screen visualization. Includes visualization of full expression. Use bubbling property
let content = document.querySelector(".content");
let numbers = document.querySelector(".numbers");
let exp = document.querySelector('.expression');
content.addEventListener('click', visualizeScreen);
//When we click or press number buttons
function visualizeNumbers () {
    if( exp.textContent.indexOf('=') !== -1) {
        exp.textContent = '';
    }
    numbers.textContent = expression.length ? expression : '0';
}
//when we click '=' o press '=' or 'Enter'
function visualizeCompute () {
    if (dataForCompute.result !== undefined){
        numbers.textContent = filterDigits(dataForCompute.result,16);
    }
    else {
        numbers.textContent = 0;
    }
    exp.textContent = dataForCompute.string;
}
//when we click AC or press Esc
function visualizeClear (){
    numbers.textContent = '0';
    exp.textContent = '';
}
//When we click or press 'Backspace'
function visualizeBackspace () {
    if (!expression.length){
        numbers.textContent = '0';
        return;
    }
    else {
        numbers.textContent = expression;
    }
}
//common function for clicking buttons
function visualizeScreen (e) {
    if (e.target.getAttribute('class') === 'num animation' ||
        e.target.getAttribute('class') === 'point animation' ||
        e.target.getAttribute('class') === 'minus animation') {
        
            visualizeNumbers ();
    }
    else if (e.target.getAttribute('class') === 'oper animation'){
        numbers.textContent = e.target.getAttribute('data-key');
        exp.textContent = dataForCompute.string;
    }
    else if (e.target.getAttribute('class') === 'compute animation'){
        visualizeCompute ();
    }
    else if (e.target.getAttribute('class') === 'clear animation'){
        visualizeClear ();
    }
    else if (e.target.getAttribute('class') === 'backspace animation'){
        visualizeBackspace ();
    }
}
//Animationing clicked or pressed buttons
let buttons = Array.from(document.querySelectorAll('button'));
//if buttons are clicked
buttons.forEach(elem => elem.addEventListener('click',(e) => { 
    e.target.classList.add('animation');
})); 
//if buttons are pressed
function animateButtons (e) {
    buttons.forEach(elem => {
        if (elem.getAttribute('data-key') === e.key ||
            (elem.getAttribute('data-key') === '=' && e.key === 'Enter')){
            elem.classList.add('animation');
            //console.log(elem);
        }
    });
}
//remove animation
buttons.forEach(elem => elem.addEventListener('transitionend',removeChangeButton));
function removeChangeButton (e) {
    if (e.propertyName!=='transform') return;
    this.classList.remove('animation');
}
