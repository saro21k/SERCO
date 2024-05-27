document.addEventListener('DOMContentLoaded', function() {
    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const balanceDisplay = document.getElementById('balance');
    const transactionList = document.getElementById('transaction-list');
    const allTransactionList = document.getElementById('all-transaction-list');
    const budgetInput = document.getElementById('budget');
    const goalInput = document.getElementById('goal');
    const toggleButton = document.getElementById('toggle-dark-mode');

    function updateBalance(amount) {
        balance += amount;
        balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        localStorage.setItem('balance', balance);
    }

    function addTransaction(amount, type) {
        transactions.push({ amount, type });
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
        allTransactionList.innerHTML = '';

        transactions.forEach(transaction => {
            const tr = document.createElement('tr');
            const tdType = document.createElement('td');
            const tdAmount = document.createElement('td');

            tdType.textContent = transaction.type;
            tdAmount.textContent = transaction.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

            tr.appendChild(tdType);
            tr.appendChild(tdAmount);

            transactionList.appendChild(tr);
            allTransactionList.appendChild(tr.cloneNode(true));
        });
    }

    function deleteAllTransactions() {
        localStorage.removeItem('transactions');
        localStorage.removeItem('balance');
        transactions = [];
        balance = 0;
        balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        renderTransactions();
        alert('Todas las transacciones y el balance han sido eliminados.');
    }

    document.getElementById('add-income').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(amount);
            addTransaction(amount, 'Ingreso');
        } else {
            alert('Por favor, introduce una cantidad válida.');
        }
    });

    document.getElementById('add-expense').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(-amount);
            addTransaction(-amount, 'Egreso');
        } else {
            alert('Por favor, introduce una cantidad válida.');
        }
    });

    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    document.getElementById('update-budget').addEventListener('click', updateBudget);
    document.getElementById('update-goal').addEventListener('click', updateGoal);

    document.getElementById('view-all-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'table';
        transactionList.style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'none';
        document.getElementById('hide-transactions').style.display = 'inline-block';
    });

    document.getElementById('hide-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'none';
        transactionList.style.display = 'table';
        document.getElementById('hide-transactions').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'inline-block';
    });

    document.getElementById('delete-all-transactions').addEventListener('click', deleteAllTransactions);

    // Initialize UI
    balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    renderTransactions();
    budgetInput.value = localStorage.getItem('budget') || '';
    goalInput.value = localStorage.getItem('goal') || '';

    // Set dark mode if previously enabled
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});
