const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productRouters = require("./routes/Product");
const brandsRouters = require("./routes/Brand");
const userRouters = require("./routes/User");
const authRouters = require("./routes/Auth")
const categoryRouters = require("./routes/Category");
const cartRouter = require("./routes/Cart");
const  ordersRouter = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const { User } = require("./model/User");
const { sanitizeUser, isAuth, cookieExtractor } = require("./services/common");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SECRET_KEY ="SECRET_KEY";
const cookieParser = require("cookie-parser");
const { Order } = require("./model/Order");




const endpointSecret = "sk_live_8sd7f6sdf76sdf87sdf";

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

   
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);


server.use(
  cors({
    origin: "http://localhost:3000", // exact frontend URL
    credentials: true, // allow cookies
    exposedHeaders: ["X-Total-Count"],
  })
);


server.use(
  session({
    secret: "Keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

server.use(passport.authenticate("session"));

server.use(cookieParser());
server.use(express.json());

main().catch(err=> console.log(err))

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("database connected")
}

server.use("/products" ,isAuth() ,  productRouters.router)
server.use("/brands",  isAuth(), brandsRouters.router);
server.use("/categories", isAuth() , categoryRouters.router);
server.use("/auth" , authRouters.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/users",isAuth(), userRouters.router);
server.use("/orders", isAuth(), ordersRouter.router);

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; 





passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    console.log({ email, password });
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); 
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);




passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);



passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});




// Payments

// This is your test secret API key.
const stripe = require("stripe")("sk_test_51QIJu1EDyIGp3ib4mrP67gdHaDDgpqg3iLY0AlxXq3oB8cLmVISRoOs1M16vYqhVhLAxqL1oCGR9goXbaXuO5kQ800eRSlORrk");

server.post('/create-payment-intent', async (req, res) => {
  const { totalAmount, orderId } = req.body;
console.log("Request body:", req.body);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});






server.get('/' ,(req , res) =>{
    res.json({status :"suceess"}) 
} )







server.listen(8000 ,() =>{
    console.log("server is listening is 8000");
}) 
