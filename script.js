document.addEventListener('DOMContentLoaded', function() {
    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const balanceDisplay = document.getElementById('balance');
    const transactionList = document.getElementById('transaction-list');
    const allTransactionsList = document.getElementById('all-transactions');
    const budgetInput = document.getElementById('budget');
    const goalInput = document.getElementById('goal');

    function updateBalance(amount) {
        balance += amount;
        balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO');
        localStorage.setItem('balance', balance);
    }

    function addTransaction(amount, type) {
        const transactionItem = document.createElement('li');
        transactionItem.textContent = type + ': ' + amount.toLocaleString('es-CO');
        transactions.push({ amount, type }); // Agregar nueva transacción al array
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
    }

    function updateBudget() {
        const budget = parseFloat(budgetInput.value);
        if (!isNaN(budget) && budget >= 0) {
            localStorage.setItem('budget', budget);
            alert('Presupuesto actualizado');
        } else {
            alert('Por favor, introduce un presupuesto válido.');
        }
    }

    function updateGoal() {
        const goal = parseFloat(goalInput.value);
        if (!isNaN(goal) && goal >= 0) {
            localStorage.setItem('goal', goal);
            alert('Meta de dinero actualizada');
        } else {
            alert('Por favor, introduce una meta válida.');
        }
    }

    function renderTransactions() {
        transactionList.innerHTML = '';
        allTransactionsList.innerHTML = '';

        const recentTransactions = transactions.slice(-10); // Obtener las últimas 10 transacciones

        recentTransactions.forEach(transaction => {
            addTransactionElement(transaction.amount, transaction.type, transactionList);
        });

        transactions.slice(0, -10).forEach(transaction => {
            addTransactionElement(transaction.amount, transaction.type, allTransactionsList);
        });
    }

    function addTransactionElement(amount, type, list) {
        const transactionItem = document.createElement('li');
        transactionItem.textContent = type + ': ' + amount.toLocaleString('es-CO');
        list.appendChild(transactionItem);
    }

    function deleteAllTransactions() {
        localStorage.removeItem('transactions');
        localStorage.removeItem('balance'); // Eliminar el balance del almacenamiento local
        transactions = [];
        balance = 0; // Actualizar el balance a cero
        balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO');
        renderTransactions();
        alert('Todas las transacciones y el balance han sido eliminados.');
    }

    document.getElementById('add-income').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(amount);
            addTransaction(amount, 'Ingreso');
        }
    });

    document.getElementById('add-expense').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(-amount);
            addTransaction(amount, 'Egreso');
        }
    });

    document.getElementById('update-budget').addEventListener('click', updateBudget);

    document.getElementById('update-goal').addEventListener('click', updateGoal);

    document.getElementById('view-all-transactions').addEventListener('click', function() {
        allTransactionsList.style.display = 'block';
        document.getElementById('view-all-transactions').style.display = 'none';
        document.getElementById('hide-transactions').style.display = 'inline-block';
    });

    document.getElementById('hide-transactions').addEventListener('click', function() {
        allTransactionsList.style.display = 'none';
        document.getElementById('hide-transactions').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'inline-block';
    });

    document.getElementById('delete-all-transactions').addEventListener('click', deleteAllTransactions);

    // Initialize UI
    balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO');
    renderTransactions();
    const savedBudget = parseFloat(localStorage.getItem('budget')) || 0;
    const savedGoal = parseFloat(localStorage.getItem('goal')) || 0;
    budgetInput.value = savedBudget;
    goalInput.value = savedGoal;
});
