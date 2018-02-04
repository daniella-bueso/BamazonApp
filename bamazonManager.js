//Bring in my sql + inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//Create a connection to mysql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: "", //enter your own mysql password
	database: "bamazon"
});

//Execute connection that displays a list with menu options
connection.connect(function(err){
    if (err) throw err;
    displayMenu();
});
//===================================================================================================

//Lists a set of menu options
function displayMenu() {
    inquirer.prompt({
        name: 'menuOptions',
        type: 'rawlist',
        message: "Select one of the following menu options",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    })
    .then(function(answer) {
        switch(answer.menuOptions) {
            case "View Products for Sale":
            viewProducts();
            break;

            case "View Low Inventory":
            lowInventory();
            break;

            case "Add to Inventory":
            addItems();
            break;

            case "Add New Product":
            newProduct();
            break;
        }
    });
};

//================================== VIEW OF ALL PRODUCTS =======================================
//View Products for Sale option displays all items in columns ids, names, prices, and quantities
function viewProducts() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.log("");
        console.log("Complete Inventory List");
        var table = new Table({
			head: ['Id', 'Product Description', 'Price', 'Quantity'],
			colWidths: [5, 50, 8, 10],
			colAligns: ['center', 'left', 'right', 'center'],
			style: {
				head: ['cyan'],
				compact: true
			}
	    });//end table
	    for (var i = 0; i < res.length; i++) {
	      table.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
	    }
    	console.log(table.toString());
    	console.log("");
        displayMenu();
    });
};

//================================== VIEW OF LOVE INVENTORY =======================================
//View Low Inventory option lists all items with an inventory count lower than 5
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_Quantity < 5 ", function (err, res) {
        if(err) throw err;
        console.log("");
        console.log("Low Inventory Items");
        var table = new Table({
			head: ['Id', 'Product Description', 'Price', 'Quantity'],
			colWidths: [5, 50, 8, 10],
			colAligns: ['center', 'left', 'right', 'center'],
			style: {
				head: ['cyan'],
				compact: true
			}
	    });//end table
	    for (var i = 0; i < res.length; i++) {
	      table.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
	    }
    	console.log(table.toString());
    	console.log("");
        displayMenu();
    });
};

//================================== ADD TO INVENTORY =======================================
//Add to inventory will display a prompt that lets manager add more of any item currently in the store
function addItems() {        
        //Start of inquirer to add items to inventory
        inquirer.prompt({
            name: "item_name",
            type:"input",
            message:"What is the ID number of the product you want to add inventory for?"
        }).then(function(answer1){
            var selection = answer1.item_name;
            connection.query("SELECT * FROM products WHERE id=?", selection, function(err, res) {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("That Product does not exist!");
                    addItems();
                }
                else {
                    inquirer.prompt({
                        name: "item_quantity",
                        type: "input",
                        message: "How many items do you want to add to the inventory?"
                    }).then(function(answer2){
                        var currentQuantity = parseInt(res[0].stock_quantity);
                        var quantity = parseInt(answer2.item_quantity);
                        if (quantity < 0) {
                            console.log("Please enter a number higher than 0");
                            addItems();
                        }
                        else{
                            var newQuantity = currentQuantity + quantity;
                            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {id: res[0].id}], function(err, res){
                                if (err) throw err;
                                console.log("");
                                console.log("Quantity has been updated! Check your inventory.");
                                console.log("");
                                displayMenu();
                            });
                        }; //end of else
                    }); //end of answer2 function
                }; //end of else
            }); //end of query
        }); //end of answer1 function
};

//================================== ADD NEW PRODUCTS TO STORE =======================================
//Add New Product allows manager to add a completely new product to the store.
function newProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Please enter the name of the product you'd like to add"
        }, {
            name: "department",
            type: "input",
            message: "What department does this item belong to?"
        }, {
            name: "price",
            type: "input",
            message: "Please enter the price of this item",
        }, {
            name: "stockQuantity",
            type: "input",
            message: "Please enter the stock for this item"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.stockQuantity}, function(err) {
                if (err) throw err;
                console.log("");
                console.log("You successfully added new item!")
                console.log("");
                console.log("Product Name: " + answer.name);
                console.log("Department Name: " + answer.department);
                console.log("Price Name: " + answer.price);
                console.log("Stock Quantity: " + answer.stockQuantity);
                console.log("");
                displayMenu();
        }); //end of query
    })
}; //end of function