//logout
document.getElementById("logout-button").addEventListener("click", function() {
  window.location.href = "../Login/login.html";
});
//add expense
const token = localStorage.getItem('token');
async function ExpenseTracker(event) {
  try {
    event.preventDefault();
    const price = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;

    const expenseDetails = {
      price: price,
      description: description,
      category: category,
    }
    console.log(expenseDetails);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const response = await axios.post("http://localhost:3000/expense/addExpense", expenseDetails,{headers:{"Authorization" : token,"userEmail":email}});
    console.log(response);
    if (response.status === 201) {
      addNewExpensetoUI(response.data.expense);
      window.location.reload();
    }
    else {
      throw new Error('Failed to create expense');
    }
  }
   catch (err) {
    console.error(err);
    document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
  }
  event.target.amount.value ='';
  event.target.description.value='';
}
window.addEventListener('load', async () => {
  try {
    const check = localStorage.getItem('isPremiumUser');
    const userEmail = localStorage.getItem('userEmail');
    console.log(userEmail);
    const response = await axios.get('http://localhost:3000/expense/getExpenses', 
     {
      headers: { "Authorization": token , email:userEmail,  isPremiumUser :  check}
    });
    console.log(response);
    if (response.status === 200) {
      response.data.expenses.forEach(expense => {
        addNewExpensetoUI(expense);
        
      }); 
      initializePagination(response.data.expenses)
    } 
    else if (response.status === 201) {
        response.data.expenses.forEach(expense => {
          addNewExpensetoUI(expense);
        });
        console.log(response.data.expenses);
       initializePagination(response.data.expenses)
       document.getElementById('rzp-button1').remove();
   }
  } catch (error) {
    console.log( error);
  }
});
function initializePagination(expenses) {
  const itemsPerPage = 5;
  let currentPage = 1;

  function renderPage(page) {
      const parentElement = document.getElementById('listOfExpenses');
      parentElement.innerHTML = ''; // Clear the parent element
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const expensesToRender = expenses.slice(startIndex, endIndex);
      
      expensesToRender.forEach(expense => {
          addNewExpensetoUI(expense);
      });
  }

  function navigateToPage(page) {
      currentPage = page;
      renderPage(currentPage);
  }
  let curPage = 1;
  // Example of adding event listeners to page navigation buttons
  document.getElementById('prevPageBtn').addEventListener('click', () => {
      if (currentPage > 1) {
          navigateToPage(currentPage - 1);
          curPage--;
          document.getElementById("currentPage").textContent = curPage;
      }
  });

  document.getElementById('nextPageBtn').addEventListener('click', () => {
      const totalPages = Math.ceil(expenses.length / itemsPerPage);
      if (currentPage < totalPages) {
          navigateToPage(currentPage + 1);
          curPage++;
          document.getElementById("currentPage").textContent = curPage;
      }
  });

  renderPage(currentPage);
}

var isActive = true;
let cnt = 0;

function addNewExpensetoUI(expense){
  console.log(expense);
  const parentElement = document.getElementById('listOfExpenses');
  let expenseElemId = `${expense._id}`;
  console.log(expenseElemId);
  parentElement.innerHTML += ``
  const table = document.createElement('table');
   table.classList.add('table');

  // add style
  table.classList.add('custom-table');
  const tableHead = document.createElement('thead');
  const headerRow = document.createElement('tr');
// Append the header row to the table head
  tableHead.appendChild(headerRow);

  const tableBody = document.createElement('tbody');

const rowData = [
  { col1:cnt, col2: expense.price, col3: expense.description, col4:expense.category}
 ];
 console.log(rowData);

rowData.forEach(rowDataItem => {
  const row = document.createElement('tr');
  // Create data cells and populate with content
  for (const key in rowDataItem) {
      const cell = document.createElement('td');
      cell.textContent = rowDataItem[key];
      row.appendChild(cell);
  }
  // Append the row to the table body
  tableBody.appendChild(row);
  
});
// Append the table body to the table

table.appendChild(tableBody);
parentElement.appendChild(table);
parentElement.innerHTML += `
<li id=${expenseElemId}>
          <button class="btn btn-primary btn-sm" onclick=deleteExpense(0,'${expense._id}')>
              Delete Expense
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick=EditUser('${expense._id}')>Edit</button> 
           </li> `
}
cnt++;

async function deleteExpense(e,expenseid) {
  try {
      const userEmail = localStorage.getItem('userEmail');
      console.log(e);
      const response = await axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseid}`, { headers: { "Authorization": token, email:userEmail} });
      if (response.status === 200) {
          removeExpensefromUI(expenseid);
         if(!e){
           window.location.reload();
         }
      } else {
          throw new Error('Failed to delete');
      }
  }catch (err) {

      console.log(err);
  } 
}


async function EditUser(id) {
  try {
    const userEmail = localStorage.getItem('userEmail');
    console.log(userEmail);
    const token = localStorage.getItem('token');
    console.log(token);
    const response = await axios.put(`http://localhost:3000/expense/editExpense/${id}`, {
      headers: {  email: userEmail }
    });
    console.log(response);
    if (response.status === 200) {
      const expenseData = response.data;
      document.getElementById("amount").value = expenseData.amount;
      document.getElementById("description").value = expenseData.description;
      document.getElementById("category").value = expenseData.category;
      const updatedData = {
        amount: document.getElementById("amount").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value
      };
      await updateExpense(id, updatedData);
    } else {
      throw new Error('Failed to fetch expense for editing');
    }
  } catch (err) {
    console.log(err);
  }
}
function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
  const expenseElemId = document.getElementById(listOfExpenses);
  console.log(expenseElemId);
}

// Function to update the pagination UI
let currentPage = 1;
function updatePagination(paginationInfo) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const currentPage = paginationInfo.currentPage;
  const lastPage = paginationInfo.lastPage;

  for (let i = 1; i <= lastPage; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;

    if (i === currentPage) {
      pageLink.classList.add("active");
    }

    pageLink.addEventListener("click", () => {
      fetchExpenses(i, document.getElementById("limitM").value);
    });

    paginationContainer.appendChild(pageLink);
  }
}

// Function to handle the item per page change
function handleItemsPerPageChange() {
  const newItemsPerPage = document.getElementById("limitM").value;
  fetchExpenses(1, newItemsPerPage);
}

// Initial page load



function showLeaderboard(){
  const inputElement = document.createElement("input")
  inputElement.type ="button";
  inputElement.value = "Show LeaderBoard";
  inputElement.onclick = async()=>{
    const token = localStorage.getItem('token')
    const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } })
    console.log(userLeaderBoardArray);

    var leaderboardElem = document.getElementById('leaderboard');
    leaderboardElem.innerHTML += '<h1> Leader board </h1>'
    userLeaderBoardArray.data.forEach((expenseDetails) => {
      leaderboardElem.innerHTML += `<li>Name - ${expenseDetails.name} Total Expenses - ${expenseDetails.totalExpenses ?? 0}</li>`
    })
  }
  document.getElementById("message").appendChild(inputElement);
}

function download(){
  axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response.status === 201){
        alert('file is downloaded!')
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
          
      } else {
          throw new Error(response.data.message)
      }
  })
  .catch((err) => {
      showError(err)
  });
}



