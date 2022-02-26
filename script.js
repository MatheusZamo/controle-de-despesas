//Pegando os ids do HTML
const transactionUl = document.querySelector('#transactions');
const totalDisplay = document.querySelector('#balance');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const span = document.querySelector('#span');

/*Array de objetos, com exemplo de transações 
let transactions = [
    {id:1, name:'Bolo de brigadeiro', amount:-20},
    {id:2, name:'Salario', amount:300},
    {id:3, name:'Torta de frango', amount:-10},
    {id:4, name:'Aula de Violão', amount:150}
]
*/

//Criando um local storage,
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// Criando o array de objetos, com a condicional que verifica se ja existe alguma transação no local storage,se sim ele nos devolve as transações, se não e devolvido um array vazio, sem nenhuma transação
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//Função que remove as transações, criando um array somente com as transações que não foram clicadas no X, a função init atualiza as transações restantes e a função updateLocalStorage atualiza o local storage
const removeTransactions = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
}

//Criando uma função, que adiciona a transação no dom
const addTransactionIntoDOM = transaction =>{
    //criando o operador, se a quantidade inserida for menor que 0,o operador sera -,se a quantidade inserida for maior que 0 o operador ira ser +
    const operator = transaction.amount < 0 ? '-':'+';

    //criando a classe css,que vai conter o operador, usando o mesmo operador ternario acima 
    const CSSClass = transaction.amount < 0 ? 'minus':'plus';

    //Usando o metodo asb do Math, para evitar que o operador apareça 2 vezes
    const amountWithoutOperator = Math.abs(transaction.amount);

    //criando a lista no HTML
    const li = document.createElement('li');

    //adicionando a classe css na lista
    li.classList.add(CSSClass);

    //inserindo a lista no HTML com as interpolações com os valores contidos 
    li.innerHTML = `
    ${transaction.name} 
    <span>${operator}R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick='removeTransactions(${transaction.id})'>
        x
    </button>
    `;

    //usando o metodo append, que recebe um argumento e adiciona ele como ultimo filho do elemento que ele foi encadiado, Adicionando na UL a ultima li criada como o primeiro filho 
    transactionUl.append(li);
}

//Função que calcula o saldo atual, receitas e despesas
const updateBalanceValues = () => {
    //usando o map para criar um array somente com a quantidade da transação, que e o objeto amount
    const transactionAmount = transactions.map(transaction => transaction.amount);

    //usando o reduce para pegar todos os valores do array criado com o map acima e, somando os numeros para reduzir em um numero apenas,e usanso o toFixed para adicionar numeros decimais no final do valor 
    const total = transactionAmount
    .reduce((accumulator, transaction)=> accumulator + transaction, 0)
    .toFixed(2);

    //Usando o filter, para filtrar e criar um array somente com os numeros maiores que 0, reduce para somar os valores dentro do array e toFixed para acrescentar 2 numeros decimais 
    const income = transactionAmount
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value,0)
    .toFixed(2);

    //Mesma logica da variavel acima, o que muda e que estamos pegando os numeros menores que 0,Math.abs e usado para tirar o operador, e nos devolve o valor absoluto 
    const expense = Math.abs(transactionAmount
    .filter((value) => value < 0)
    .reduce((accumulator,value) => accumulator + value,0))
    .toFixed(2)

    //Adicionando os valores na tela 
    totalDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () =>{

    //limpando a ul para não repetir as transaçoes 
    transactionUl.innerHTML = ''

    //Iterando sobre o array das transações, para cada item do array, ele e inserido no dom
    transactions.forEach(addTransactionIntoDOM);

    //Chamando a função que calcula o saldo atual, receitas e despesas
    updateBalanceValues();
}
init();

//Função que atualiza o local storage
const updateLocalStorage = () => {
    localStorage.setItem('transactions',JSON.stringify(transactions))
}

//função que gera um id aleatorio de 1 a 1.000
const generateId = () => Math.round(Math.random() * 1000)

//utilizando um escutador de evento no formulario
form.addEventListener('submit',event => {

    //prevendo o comportamento padrao do form, que e recarregar a pagina e enviar 
    event.preventDefault();

    //Pegando os valores dos inputs nome e valor, e o metodo trim tira todo espaço vazio do começo ou final da string inserida 
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();

    // condição para conferir se os dois campos estão preenchidos
    if(transactionName == '' || transactionAmount == ''){
        mostraMensagem();
        return
    }
    limpaMensagem();
    //Crinado um objeto com os campos de id,nome e valor ,o metodo number transforma o resultado de transactionAmount em um numero
    const transaction = {
        id: generateId(), 
        name: transactionName, 
        amount: Number(transactionAmount)
        
    }
    ;

    //Adicionando a transação inserida no array de objetos
    transactions.push(transaction);

    //Função que atualiza a lista de transações e a função que atualiza o local storage
    init();
    updateLocalStorage();

    //Limpando os inputs depois que forem adicionados a lista 
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''

})

//My Features
//Função que cria uma mensagem de erro
const mostraMensagem = () => {
    span.classList.add('#span');
 const frase = span.textContent = 'Preencha os dois campos';
}
//Função que limpa o conteudo da mensagem
const limpaMensagem = () => {
    const frase = span.innerHTML = '';
}
