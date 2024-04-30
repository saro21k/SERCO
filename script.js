document.addEventListener('DOMContentLoaded', function() {
    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const balanceDisplay = document.getElementById('balance');
    const transactionList = document.getElementById('transaction-list');
    const allTransactionList = document.getElementById('all-transaction-list');
    const budgetInput = document.getElementById('budget');
    const goalInput = document.getElementById('goal');

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

        const tableBody = document.createElement('tbody');
        tableBody.id = 'transaction-table-body';

        transactions.forEach(transaction => {
            const tr = document.createElement('tr');
            const tdType = document.createElement('td');
            const tdAmount = document.createElement('td');

            tdType.textContent = transaction.type;
            tdAmount.textContent = transaction.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

            tr.appendChild(tdType);
            tr.appendChild(tdAmount);

            tableBody.insertBefore(tr, tableBody.firstChild);
            allTransactionList.appendChild(tr.cloneNode(true));
        });

        transactionList.appendChild(tableBody);
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
        }
    });

    document.getElementById('add-expense').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(-amount);
            addTransaction(-amount, 'Egreso');
        }
    });

    document.getElementById('update-budget').addEventListener('click', updateBudget);

    document.getElementById('update-goal').addEventListener('click', updateGoal);

    document.getElementById('view-all-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'table';
        document.getElementById('transaction-list').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'none';
        document.getElementById('hide-transactions').style.display = 'inline-block';

        // Agregar atributo style a la tabla #all-transactions
        allTransactionList.setAttribute('style', 'min-width: 200px;');
    });

    document.getElementById('hide-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'none';
        document.getElementById('transaction-list').style.display = 'table';
        document.getElementById('hide-transactions').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'inline-block';

        // Eliminar atributo style de la tabla #all-transactions
        allTransactionList.removeAttribute('style');
    });

    // Initialize UI
    balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    renderTransactions();
    const savedBudget = parseFloat(localStorage.getItem('budget')) || 0;
    const savedGoal = parseFloat(localStorage.getItem('goal')) || 0;
    budgetInput.value = savedBudget;
    goalInput.value = savedGoal;
});
