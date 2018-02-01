//Bring in my sql + inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify");

//Create a connection to mysql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: "daniella7.",
	database: "bamazon"
});
//Execute connection that displays all items for sale
connection.connect(function(err){
    if (err) throw err;
    displayAll();
});

//Function to display all items for sale
function displayAll() {
    connection.query("SELECT id, product_name, price FROM products", function(err, res){
        if (err) throw err;
        console.log('-------------------------------------------');
        console.log('              WELCOME TO BAMAZON           ');
        console.log('-------------------------------------------');
        console.log(columnify(res));
        console.log('-------------------------------------------');
        productId();
    });
};

//Function to prompt user to enter id of product to buy
function productId() {
    inquirer.prompt([
        {
            name: 'productId',
            type: "input",
            message: "Please enter the Id of the product you wish to buy!"
        }
    ]).then(function(answer){
        var selection = answer.productId;
        connection.query("SELECT * FROM Products WHERE id=?", selection, function(err, res){
            if (err) throw err;

            //If results equal to 0 then prompt user to pick again and run productId function again
            if (res.length === 0){
                console.log('That product does not exist, please enter an Id number from the list above');
                productId();
            }
            //Else if id does exist, ask user how many items they would like to buy
            else{
                inquirer.prompt([
                    {
                        name: 'productQuantity',
                        type: "input",
                        message: "How many items would you like to buy?!"
                    }
                ]).then(function(answer){
                    var quantity = answer.productQuantity;
                    //If quantity is less than stock quantity display error message
                    if (quantity > res[0].stock_quantity) {
                        console.log('Cannot proceed, we only have ' + res[0].stock_quantity + ' items of the product selected');
                    productId();
                    }
                    //Else display the name and price of product chosen
                    else {
                        console.log(res[0].product_name + ' purchased.')
                        connection.end();
                    }//end of else for second question
                });
            };//end of else for first question
        });//end of query
    });
};

//