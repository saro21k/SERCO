document.addEventListener('DOMContentLoaded', function() {

    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const balanceDisplay = document.getElementById('balance');
    const transactionList = document.getElementById('transaction-list');
    const allTransactionList = document.getElementById('all-transaction-list');
    const budgetInput = document.getElementById('budget');
    const goalInput = document.getElementById('goal');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');

    function updateBalance(amount) {
        balance += amount;
        balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        localStorage.setItem('balance', balance);
    }

    function addTransaction(amount, type) {
        const description = descriptionInput.value.trim();
        const transaction = { amount, type, description };
        transactions.push(transaction);
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

        // Invertimos las transacciones para mostrar la más reciente primero
        const reversedTransactions = [...transactions].reverse();

        reversedTransactions.forEach((transaction, index) => {
            const tr = document.createElement('tr');
            const tdType = document.createElement('td');
            const tdAmount = document.createElement('td');
            const tdDescription = document.createElement('td');
            const tdDelete = document.createElement('td');
            const deleteButton = document.createElement('button');

            tdType.textContent = transaction.type;
            tdAmount.textContent = transaction.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
            tdDescription.textContent = transaction.description;
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'btn btn-danger';
            deleteButton.onclick = function() {
                deleteTransaction(index);
            };

            tr.appendChild(tdType);
            tr.appendChild(tdAmount);
            tr.appendChild(tdDescription);
            tdDelete.appendChild(deleteButton);
            tr.appendChild(tdDelete);

            transactionList.appendChild(tr);
            allTransactionList.appendChild(tr.cloneNode(true));
        });
    }

    function deleteTransaction(index) {
        const transaction = transactions[transactions.length - 1 - index];
        if (transaction.type === 'Ingreso') {
            updateBalance(-transaction.amount);
        } else if (transaction.type === 'Egreso') {
            updateBalance(transaction.amount);
        }
        transactions.splice(transactions.length - 1 - index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
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
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(amount);
            addTransaction(amount, 'Ingreso');
            amountInput.value = '';
            descriptionInput.value = '';
        } else {
            alert('Por favor, introduce una cantidad válida.');
        }
    });

    document.getElementById('add-expense').addEventListener('click', function() {
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            updateBalance(-amount);
            addTransaction(-amount, 'Egreso');
            amountInput.value = '';
            descriptionInput.value = '';
        } else {
            alert('Por favor, introduce una cantidad válida.');
        }
    });

    const toggleButton = document.getElementById('toggle-dark-mode');
    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('update-budget').addEventListener('click', updateBudget);
    document.getElementById('update-goal').addEventListener('click', updateGoal);

    document.getElementById('view-all-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'table';
        document.getElementById('transaction-list').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'none';
        document.getElementById('hide-transactions').style.display = 'inline-block';
    });

    document.getElementById('hide-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions').style.display = 'none';
        document.getElementById('transaction-list').style.display = 'table';
        document.getElementById('hide-transactions').style.display = 'none';
        document.getElementById('view-all-transactions').style.display = 'inline-block';
    });

    document.getElementById('delete-all-transactions').addEventListener('click', deleteAllTransactions);

    // Initialize UI
    balanceDisplay.textContent = 'Balance: ' + balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    renderTransactions();
    const savedBudget = parseFloat(localStorage.getItem('budget')) || 0;
    const savedGoal = parseFloat(localStorage.getItem('goal')) || 0;
    budgetInput.value = savedBudget;
    goalInput.value = savedGoal;
});
