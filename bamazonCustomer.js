var mysql = require("mysql");
var inquirer = require("inquirer");

var purchaseID;
var purchaseQuantity;
var newStock;
var productName;
var productPrice;

// store an instance of a connection in a var
var connection = mysql.createConnection({
  host: "localhost", // connect to the local mysql app on the computer
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon" // need to be connecting to a database that exists locally (like in workbench)
});

// that var has a variable on it bc of the create connection, so it makes the connection and then has an anonymous fx   n as its callback
connection.connect(function(error){
  if(error) {
    console.log(error);
  }
});


function showAvailableItems() {
  connection.query('SELECT * FROM products', function (error, result) {
    if(error) {
      console.log(error);
    } else {
      console.log('-----------------------------------------------------------');
      for (var i = 0; i < result.length; i++) {
        var dollarView = '$' + result[i].price;
        console.log('Item ID: ' + result[i].item_id + '\nProduct Name: ' + result[i].product_name + '\nDepartment: ' + result[i].department_name + '\nPrice: ' + dollarView + '\nQuantity in Stock: ' + result[i].stock_quantity);
        console.log('-----------------------------------------------------------');
        //itemArray.push(JSON.stringify(result[i].id));
      }
      // console.log(itemArray);
      bidPrompt();
    }
  }); 
}



function confirmPurchase() {
    connection.query('SELECT * FROM products WHERE item_id = ?', [purchaseID], function(err, res) {
        if (err) {
            console.log(err);
        } else {
            if (res[0] === undefined) {
                console.log('\nYou need to enter an available item ID!\n');
                continueShoppingPrompt();
            } else {
                productName = res[0].product_name;
                productPrice = res[0].price;
                console.log('\nYour basic order preview');
                console.log('------------------------')
                console.log('Quantity: ' + purchaseQuantity + ' Item: ' + res[0].product_name);
                var dollarView = '$' + productPrice;
                console.log('At ' + dollarView + ' each.\n')
               
            
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Would you like to continue with your purchase?',
                }]).then(function(choice) {

                    if (choice.confirm) {
                        // purchase the item as long as it's in stock
                        if ((purchaseQuantity <= res[0].stock_quantity) && (res[0].stock_quantity > 0)) {
                            // purchase the item
                            // calculates newStock from the stock in the database minus the quantity purchased
                            newStock = res[0].stock_quantity - purchaseQuantity;
                            // calls updateProducts function, which updates the database to reduce the stock
                            updateProducts();
                        } else {
                            console.log('Insufficient supply!');
                            // if the buyer tried to purchase too many items, but there are still some left in stock,
                            // this tells the user how many items are available to purchase
                            if (res[0].stock_quantity > 0) {
                                console.log('Quantity left in stock: ' + res[0].stock_quantity);
                            }
                            continueShoppingPrompt();
                        }
                    } else {
                        // shows items in the database
                        showAvailableItems();
                    }
                });    
            }
        }
    });
}

// generates a receipt for the user and the asks them if they'd like to continue shopping
function receipt() {
    console.log('\n\nRECEIPT');
    console.log('Thank you for your purchase!');
    console.log('============================');
    console.log('ID# ' + purchaseID + '  ' + productName);
    var dollarView = '$' + productPrice;
    console.log('Qty: ' + purchaseQuantity + '  at ' + dollarView);
    var subtotal = productPrice * purchaseQuantity;
    console.log('============================');
    console.log('Subtotal: ' + subtotal);
    var tax = subtotal * 0.07;
    console.log('Tax: ' + tax);
    console.log('----------------------------');
    var total = subtotal + tax;
    total = '$' + total;
    console.log('Total: ' + total);
    console.log('============================\n');
    continueShoppingPrompt();
}


// updates the database upon purchase to reflect lower inventory
function updateProducts() {

    // updates the database to reduce the stock by the quantity of items purchased (matching the item's ID number)
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStock, purchaseID], function(err, res) {
        if (err) {
            console.log(err);
        } else {
            // generates a receipt for the user to confirm their purchase and cost
            receipt();
        }
    });
}



// prompts the user to enter in an item ID and quantity they'd like to purchase of that item
function bidPrompt() {

    console.log('===========================================================')
    console.log('The products currently available are listed above.');
    console.log('-----------------------------------------------------------');

    // get properties from the user: 
    inquirer.prompt([{
       type: "input",
       message: "Please enter the item ID of the product you would like to buy.",
       name: 'itemID'
     },{
       type: "input",
       message: "How many would you like to purchase?",
       name: 'quantity'
     }
     ]).then(function(purchase) {

    // stores these prompts into global variables
    purchaseID = purchase.itemID;
    purchaseQuantity = purchase.quantity;

    confirmPurchase();
  })
}

// Asks user if they'd like to continue shopping or exit bamazon.
function continueShoppingPrompt() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to continue shopping?',
    }]).then(function(shopAgain) {
        if (shopAgain.continue) {
            showAvailableItems();
        } else {
            end();
        }
    });
}


// to disconnect from the database
var end = function() {
    connection.end(function(err) {
        // The connection is terminated now
    });
}


// this is the first funciton call upon starting the program - the rest are called in other functions
showAvailableItems();