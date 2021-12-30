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
        expression+= e.target.textContent;
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


//Screen visualization. Includes visualization of full expression. Use bubbling property
let content = document.querySelector(".content");
let numbers = document.querySelector(".numbers");
let exp = document.querySelector('.expression');

content.addEventListener('click', visualizeScreen);
function visualizeScreen (e) {
    if (e.target.getAttribute('class') === 'num' ||
        e.target.getAttribute('class') === 'point' ||
        e.target.getAttribute('class') === 'minus'){
        
        if( exp.textContent.indexOf('=') !== -1) {
            exp.textContent = '';
        }
        numbers.textContent = expression.length ? expression : '0';
    }
    else if (e.target.getAttribute('class') === 'oper'){
        numbers.textContent = e.target.textContent !== 'Xa' ? e.target.textContent : '^';
        exp.textContent = dataForCompute.string;
    }
    else if (e.target.getAttribute('class') === 'compute'){
        if (dataForCompute.result !== undefined){
            numbers.textContent = filterDigits(dataForCompute.result,16);
        }
        else {
            numbers.textContent = 0;
        }
        exp.textContent = dataForCompute.string;
    }
    else if (e.target.getAttribute('class') === 'clear'){
        numbers.textContent = '0';
        exp.textContent = '';
    }
    else if (e.target.getAttribute('class') === 'backspace'){
        if (!expression.length){
            numbers.textContent = '0';
            return;
        }
        else {
            numbers.textContent = expression;
        }
    }
}

//Displaying only 16 digits of result
function filterDigits (number, size){
    let str = `${number}`;
    console.log(number);

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
        dataForCompute.operator = e.target.getAttribute('data-key');
        dataForCompute.makeString('part');   
    }
    else if (!isNaN(parseFloat(expression)) && dataForCompute.operator && dataForCompute.result === undefined){
        dataForCompute.secondNumber =  parseFloat(expression);
        expression='';
        dataForCompute.result = operate(dataForCompute.firstNumber, dataForCompute.operator, dataForCompute.secondNumber);
        dataForCompute.firstNumber = dataForCompute.result;
        dataForCompute.operator = e.target.getAttribute('data-key');
        dataForCompute.makeString('part');
        dataForCompute.result = undefined;
    }
    else if (isNaN(parseFloat(expression)) && dataForCompute.operator && dataForCompute.result !== undefined){
        dataForCompute.firstNumber = dataForCompute.result;
        dataForCompute.operator = e.target.getAttribute('data-key');
        dataForCompute.makeString('part');
        dataForCompute.result = undefined;
    }
    else if (isNaN(parseFloat(expression)) && dataForCompute.operator && dataForCompute.result === undefined){
        dataForCompute.operator = e.target.getAttribute('data-key');
        dataForCompute.makeString('part');
    }
}
//Event handler for = button
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
        /*else if (dataForCompute.operator && dataForCompute.result === undefined){
            dataForCompute.secondNumber = dataForCompute.firstNumber;
        }*/
        else if (!dataForCompute.operator && dataForCompute.result === undefined){
            return;
        }
        /*else {
            clearAll();
            return;
        }*/
    }
    dataForCompute.makeString('full');
    dataForCompute.result = (operate(dataForCompute.firstNumber, dataForCompute.operator, dataForCompute.secondNumber));///
}

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

window.addEventListener('keydown', (e) =>{
    console.log(e);
});

