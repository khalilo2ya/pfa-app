const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ecommerce:hopehorizonEcommerce@cluster0.i5vgcla.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true

    
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("Error connecting to MongoDB :", error);
});
app.get("/", (req, res) => {
    res.send("Express App is running")
});

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})
const products = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    oldprice: {
        type: Number,
        required: true,
    },
    newPrice: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }

})
// add product
app.post('/addProduct', async (req, res) => {
    let product = await products.find({});
    let id;
    if (product.length > 0) {
        let last_product_array = product.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const produit = new products({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        oldprice: req.body.oldprice,
        newPrice: req.body.newPrice,
    });

    console.log(produit);

    await produit.save();
    console.log("saved");

    res.json({
        success: true,
        name: req.body.name,
    });
});
// remove product
app.post('/removeProduct', async (req, res) => {
    await products.findOneAndDelete({ id: req.body.id });
    console.log('removed');
    res.json({
        success: true,
        name: req.body.name,
    })
})
app.get('/NewCollections', async (req, res) => {
    let product = await products.find({});
    let newCollection = product.slice(1).slice(-8);
    console.log("New Collection is Fetched");
    res.send(newCollection);
})
// fetch all product
app.get('/allProducts', async (req, res) => {
    let product = await products.find({});
    console.log("All product Fetched");
    res.send(product);
})
app.get('/bestSellers', async (req, res) => {
    let product = await products.find({});
    let BSP = product.slice(1).slice(-4);
    console.log("Best Sellers Product is Fetched");
    res.send(BSP);
});

const Users = mongoose.model('Users', {
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    cartData: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    WishlistData: {
        type: Object,
        required: true,
    }
})

//register
app.post('/register', async (req, res) => {
    let check = await Users.findOne({
        email: req.body.email
    })
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with the same email address" })
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
        cartData: {},
        WishlistData: [],
    })
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecomm');
    res.json({ success: true, token })
})


//login
app.post('/Login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecomm');
            res.json({ success: true, token })
        }
        else {
            res.json({
                success: false,
                errors: "Wrong Password"
            })
        }
    }
    else {
        res.json({
            success: false,
            errors: "Wrong Email id"
        })
    }
})


//creating middlware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authentiate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecomm');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "please authenticate using a valid token" })
        }
    }
}

app.get('/getUser', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ errors: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ errors: 'Server error' });
  }
});
//creating endpint for adding products in cartdata
app.post('/Addtocart', fetchUser, async (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
    }
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (!user.cartData) {
            user.cartData = {};
        }
        if (!user.cartData[itemId]) {
            user.cartData[itemId] = 0;
        }
        user.cartData[itemId] += 1;
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: user.cartData }
        );

        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// create endpoind for fetch cart data into the cart page
app.get('/getCart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });

        if (!userData || !userData.cartData) {
            return res.status(200).json({ success: true, cart: [] });
        }

        const cartData = userData.cartData;

        const cartItems = [];
        for (const itemId in cartData) {
            if (cartData[itemId] > 0) {
                const product = await products.findOne({ id: parseInt(itemId) });
                if (product) {
                    cartItems.push({
                        ...product._doc,
                        quantity: cartData[itemId],
                    });
                }
            }
        }

        res.json({ success: true, cart: cartItems });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// create endpoint for remove item from cart data
app.post('/RemoveFromCart', fetchUser, async (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
    }
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (!user.cartData) {
            user.cartData = {};
        }
        if (!user.cartData[itemId]) {
            user.cartData[itemId] = 0;
        }
        user.cartData[itemId] -= 1;
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: user.cartData }
        );

        res.json({ success: true, message: 'Item Removed from cart' });
    } catch (error) {
        console.error("Error Removed item from cart:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// create endpoint for Add an item to the wishlist 
app.post('/Addtowishlist', fetchUser, async (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
    }
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (!user.WishlistData) {
            user.WishlistData = {};
        }
        if (!user.WishlistData[itemId]) {
            user.WishlistData[itemId] = 0;
        }
        user.WishlistData[itemId] += 1;
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { WishlistData: user.WishlistData }
        );

        res.json({ success: true, message: 'Item added to Wishlist' });
    } catch (error) {
        console.error("Error adding item to  Wishlist:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// create endpoint  for get item from wishlist
app.get('/getFromWishlist', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });

        if (!userData || !userData.WishlistData) {
            return res.status(200).json({ success: true, Wishlist: [] });
        }

        const WishlistData = userData.WishlistData;

        const WishlistItems = [];
        for (const itemId in WishlistData) {
            if (WishlistData[itemId] > 0) {
                const product = await products.findOne({ id: parseInt(itemId) });
                if (product) {
                    WishlistItems.push({
                        ...product._doc,
                    });
                }
            }
        }

        res.json({ success: true, Wishlist: WishlistItems });
    } catch (error) {
        console.error("Error fetching Wishlist:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
//create endpoint for remove item from the wishlist
app.post('/RemoveFromWishlist', fetchUser, async (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
    }
    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.WishlistData[itemId] -= 1;
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { WishlistData: user.WishlistData }
        );

        res.json({ success: true, message: 'Item Removed from wishlist' });
    } catch (error) {
        console.error("Error Removed item from wishlist:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
//create an endpoint for get all products by it's category
app.get('Category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const all_product = await products.find({ category });
        res.status(200).json(all_product);
    } catch (error) {
        res.status(500).json({ errors: "Failed to fetch products" })

    }
});


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port)
    } else {
        console.log("Error:" + error)
    }
});

