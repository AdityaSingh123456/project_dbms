var express = require('express');
var ejs = require('ejs');
var session = require('express-session');

var bodyParser = require('body-parser');
var mysql = require('mysql');
mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node_proj"
})

function isProductInCart(cart,id){
    for(let i=0;i<cart.length;i++){
        if(cart[i].id==id){
            return true;
        }
    }
    return false;

}

function calculateTotal(cart,req,x){
    total =0;
    for(let i=0;i<cart.length;i++){
        if(cart[i].sale_price){
            total += cart[i].sale_price*cart[i].quantity*x;

        }else{
            total += cart[i].price*cart[i].quantity*x;
        }
    }
    req.session.total = total;
    return total;
}


var app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(session({secret:"secret"}))

app.listen(8081);
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //   });
    con.query("SELECT * FROM products",(err,result)=>{
        
        res.render('pages/index',{result:result});
        
    })
    


});

app.get('/Men',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products",(err,result)=>{
        
        res.render('pages/Men',{result:result});
        
    })
    

   
})

app.get('/MenSort',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products ORDER BY products.price ASC",(err,result)=>{
        
        res.render('pages/MenSort',{result:result});
        
    })
    

   
})

app.get('/Tshirt',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products WHERE type='tshirt'",(err,result)=>{
        
        res.render('pages/Men',{result:result});
        
    })
    

   
})
app.get('/Shirt',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products WHERE type='shirt'",(err,result)=>{
        
        res.render('pages/Men',{result:result});
        
    })
    

   
})
app.get('/jeans',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products WHERE type='jeans'",(err,result)=>{
        
        res.render('pages/Men',{result:result});
        
    })
    

   
})
app.get('/WomenSort',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products ORDER BY products.price ASC",(err,result)=>{
        
        res.render('pages/Women',{result:result});
        
    })
    

   
})
app.get('/Saree',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products WHERE type='saree'",(err,result)=>{
        
        res.render('pages/Women',{result:result});
        
    })
    

   
})
app.get('/Kurta',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products WHERE type='kurta'",(err,result)=>{
        
        res.render('pages/Women',{result:result});
        
    })
    

   
})

app.get('/Women',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query("SELECT * FROM products",(err,result)=>{
        
        res.render('pages/Women',{result:result});
        
    })
    

   
})

app.get('/Kids',function(req,res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    });

    con.query("SELECT * FROM products",(err,result)=>{
        
        res.render('pages/Kids',{result:result});
        
    })
    

   
})

app.post('/add_to_cart',function(req,res){
    var id = req.body.id;
    var description = req.body.description;
    var name = req.body.name;
    var price = req.body.price;
    var sale_price = req.body.sale_price;
    var quantity = req.body.quantity;
    var quan = req.body.quan-1;
    var image = req.body.image;
    var product = {id:id,name:name,price:price,sale_price:sale_price,quantity:quantity,image:image,quan:quan,description:description};

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    let sql = 'UPDATE products SET quantity = ? WHERE id = ?';
    let data = [quan,id];

    con.query(sql, data, (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
      });



    if(req.session.cart){
        var cart = req.session.cart;

        
        cart.push(product);
        
    }else{
        req.session.cart = [product];
        var cart = req.session.cart;

    }


    //Total
    calculateTotal(cart,req,1);
    res.redirect(req.get('referer'));



});

app.get('/cart',function(req,res){
    var cart = req.session.cart;
    var total = req.session.total;
    var y = 'Password';

    


    res.render('pages/cart',{cart:cart,total:total,y:y});
})

app.post('/remove_product',function(req,res){
    var id = req.body.id;
    var cart = req.session.cart;
    var quan = Number(req.body.quan) + Number(1);
    console.log(id);
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    let sql = 'UPDATE products SET quantity = ? WHERE id = ?';
    let data = [quan,id];

    con.query(sql, data, (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
      });
    

    for(let i=0;i<cart.length;i++){
        console.log(cart[i].name);
        if(cart[i].id == id){
            
            
            cart.splice(cart.indexOf(i),1);
            
        }
    }

    calculateTotal(cart,req,1);
    res.redirect('/cart');

});

app.get('/Bill',function(req,res){


    res.render('pages/Bill')
});



app.post('/coupon',function(req,res){
    var c = req.body.coupon;
    var cart = req.session.cart;
    var x=1;
    
    

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    let sql = 'SELECT discount FROM Coupons WHERE coupon = ?';
    let data = [c];


    con.query(sql, data, (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }

       
        var string=JSON.stringify(results);
        var json =  JSON.parse(string);
        console.log(json.length)
        if(json.length==0){
            console.log('if block')
            x=1;
            calculateTotal(cart,req,1);

        }else{
            console.log('else block')
            x= json[0].discount;
            calculateTotal(cart,req,1-x/100);
        }
        
        
        
        
        
        console.log('Rows affected:',json);
        
        console.log(total)
        res.redirect('/cart');
  
      });
      
      
      





});

app.post('/final',function(req,res){
    var cart = req.session.cart;
    var total = req.session.total;
    var y = 'Password';

    var email = req.body.email;
    var password = req.body.password;
    var cart = req.session.cart;


    let sql = 'SELECT * FROM Customers WHERE email = ? AND password=?';
    let data = [email,password];

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query(sql, data, (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
        var string=JSON.stringify(results);
        var json =  JSON.parse(string)
        console.log(json);
        if(json.length==0){
            y = 'Incorrect password or Username❌';
            res.render('pages/cart',{cart:cart,total:total,y:y});


        }else{
            res.render('pages/Bill',{results:json[0],cart:cart,total:total,y:y});
        }
        


  
      });










});

app.post('/register',function(req,res){

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    var city = req.body.city;
    var pincode = req.body.pincode;
    var state = req.body.state;

    

    let sql = "INSERT INTO Customers (email, password, address, state, city, pincode, name) VALUES (?,?,?,?,?,?,?)";
    let data = [email,password,address,state,city,pincode,name];

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query(sql,data, (error, results, fields) => {
        
        if (error){
          return console.error(error.message);
        }
        
        res.redirect('/cart');
        
  
      });



});











app.post('/filldb',function(req,res){

    var name = req.body.name;
    var email = req.body.email;
    var status ='DELIVERED';
    var state = req.body.state;
    
    var address = req.body.address;
    var city = req.body.city;
    var cost = req.body.cost;

    

    let sql = "INSERT INTO orders (cost, name, email, city, address, status,state) VALUES (?,?,?,?,?,?,?)";
    let data = [cost, name, email, city, address, status,state];

    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"node_proj"
        
    })

    con.query(sql,data, (error, results, fields) => {
        
        if (error){
          return console.error(error.message);
        }
        
        res.redirect('/')
        
  
      });



});


