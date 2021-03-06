'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements= function(movements, sort= false){
  containerMovements.innerHTML='';
  
  let movs= sort ? movements.slice().sort((a,b)=> a-b) : movements;

  movs.forEach((value, i, arr)=>{
    const type= value> 0 ? "deposit": "withdrawal"
    const html=`
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${value}???</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  })
}

const calcDisplayBalance= function(acc){
  acc.balance= acc.movements.reduce((a,b)=>a+b,0);
  labelBalance.textContent=`${acc.balance} ???`
}

const calcDisplaySummary= function(acc){
  const income= acc.movements.filter(mov=> mov>0).reduce((a,b)=> a+b,0);
  labelSumIn.textContent= `${income} ???`

  const out= acc.movements.filter(mov=> mov< 0).reduce((a,b)=> a+b,0);
  labelSumOut.textContent=`${Math.abs(out)} ???`

  const interest= acc.movements.filter(mov=> mov>0).map(mov=> (mov * acc.interestRate) /100).filter(int=> int>= 1).reduce((a,b)=> a+b, 0);
  labelSumInterest.textContent= `${interest} ???`

}


const createUserName= function(accs){
  accs.forEach((acc, i)=>{
    return acc.username= acc.owner.toLowerCase().split(' ').map(arr=> arr[0]).join('');
  })
}

createUserName(accounts);

const updateUI= function(acc){
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount= accounts.find(acc=> acc.username === inputLoginUsername.value);

  if(currentAccount?.pin=== Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    containerApp.style.opacity= 100;

    inputLoginUsername.value= inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
    
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount= Number(inputTransferAmount.value);
  const receiverAcc= accounts.find(acc=> acc.username === inputTransferTo.value);
  
  inputTransferAmount.value= inputTransferTo.value= '';
  inputTransferAmount.blur();
  
  if(amount> 0 && receiverAcc?.username !== currentAccount.username && currentAccount.balance >= amount){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }

})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)=== currentAccount.pin){
    const index= accounts.findIndex(acc=> acc.username===currentAccount.username);
    accounts.splice(index, 1);
  }
  containerApp.style.opacity= 0;

  inputCloseUsername.value = inputClosePin.value= '';

})

let sorted= false;

btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted);
  sorted= !sorted;



})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
