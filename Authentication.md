# BACKEND DEVELOPMENT LECTURE NOTE
# EXPRESS.JS AUTHENTICATION AND AUTHORIZATION USING JWT

**Project:** Student Portal Backend API  
**Technology Stack:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Token (JWT), Bcrypt  
**Programming Language:** JavaScript (ES6 Modules)  
**Level:** Beginner to Intermediate

---

# TABLE OF CONTENTS

1. Introduction to Backend Authentication
2. Learning Objectives
3. Understanding Authentication and Authorization
4. Introduction to JSON Web Token (JWT)
5. Understanding the JWT Structure
6. Understanding Password Hashing
7. Project Requirements and Dependencies
8. Project Folder Structure
9. Configuring ES6 Modules
10. Connecting to MongoDB
11. Creating the User Model
12. Understanding JWT Secrets
13. Generating JWT Tokens
14. Implementing User Registration
15. Implementing User Login
16. Understanding Token Storage
17. Understanding HTTP Authorization Headers
18. Implementing Authentication Middleware
19. Implementing Authorization Middleware
20. Understanding Resource Ownership
21. Creating Authentication Routes
22. Creating Protected Dashboard Routes
23. Configuring the Express Application
24. Starting the Express Server
25. Testing Authentication with Postman
26. Understanding the Complete Authentication Lifecycle
27. Common Authentication Errors
28. Security Best Practices
29. Classroom Practical Exercises
30. Assessment Questions
31. Take-Home Assignment
32. Summary

---

# 1. INTRODUCTION TO BACKEND AUTHENTICATION

In modern web applications, users must be able to create accounts, log in, and access resources that belong to them.

Consider a student portal application.

The portal has different categories of users:

- Administrators
- Lecturers
- Students

Each category has different responsibilities and permissions.

For example:

- Students should be able to view their registered courses and academic results.
- Lecturers should be able to manage assigned courses and upload students' scores.
- Administrators should be able to manage users, courses, lecturers, and other portal resources.

The backend must be able to identify who is making a request and determine whether that person has permission to perform the requested operation.

This is where authentication and authorization become important.

Authentication and authorization are security mechanisms used to control access to an application.

In this lecture, we will implement these mechanisms using Express.js and JSON Web Tokens.

## What We Are Building

We will build an authentication system for a Student Portal Backend API.

The system will support:

1. User registration.
2. User login.
3. Password hashing.
4. JWT token generation.
5. Token verification.
6. Protected API endpoints.
7. Role-based authorization.
8. Resource ownership verification.
9. User profile retrieval.

---

# 2. LEARNING OBJECTIVES

At the end of this lecture, students should be able to:

1. Explain authentication and authorization.
2. Differentiate between authentication and authorization.
3. Explain what JSON Web Tokens are.
4. Explain how JWT works.
5. Generate secure JWT secrets.
6. Hash passwords using bcrypt.
7. Create user authentication models using Mongoose.
8. Register users using Express controllers.
9. Authenticate users during login.
10. Generate JWT tokens after successful login.
11. Understand how tokens are returned to the frontend.
12. Explain how tokens are stored and retrieved.
13. Send JWT tokens through HTTP Authorization headers.
14. Create authentication middleware.
15. Create role-based authorization middleware.
16. Protect API endpoints.
17. Test authentication using Postman.

---

# 3. UNDERSTANDING AUTHENTICATION AND AUTHORIZATION

Although authentication and authorization are related, they perform different functions.

## 3.1 What Is Authentication?

Authentication is the process of verifying the identity of a user.

It answers the question:

**WHO ARE YOU?**

For example, imagine a student wants to access their student portal.

The student provides:

- Email address
- Password

The backend checks whether the email exists and whether the submitted password matches the stored password hash.

If the credentials are correct, the backend authenticates the student.

### Real-Life Example

Imagine entering a university examination hall.

The invigilator asks for your student identification card.

The identification card helps establish your identity.

This is similar to authentication in a web application.

## 3.2 What Is Authorization?

Authorization is the process of determining what an authenticated user is allowed to access or perform.

It answers the question:

**WHAT ARE YOU ALLOWED TO DO?**

For example:

A student may successfully log into the portal but should not be allowed to:

- Delete another student's account.
- Upload official examination results.
- Create administrator accounts.
- Access another student's private academic records.

A lecturer may be allowed to upload results but should not be allowed to manage administrator accounts.

### Real-Life Example

Imagine entering a university building with your identification card.

Your identification card establishes that you are a student.

However, being a student does not automatically give you access to the examination office or administrative records.

Your identity has been established, but your permissions are limited.

This is authorization.

## 3.3 Differences Between Authentication and Authorization

| Authentication | Authorization |
|---|---|
| Verifies user identity | Determines user permissions |
| Answers who are you? | Answers what can you access? |
| Happens before authorization | Follows successful authentication |
| Uses credentials and tokens | Uses roles and permissions |
| Example: User login | Example: Admin-only dashboard |

## 3.4 User Roles in Our Student Portal

We will implement three roles.

### Administrator

The administrator has the highest level of access.

Permissions:

- Create student accounts.
- Manage lecturers.
- Create courses.
- Assign lecturers to courses.
- Manage academic sessions.
- View student records.
- Manage examination results.

### Lecturer

The lecturer has academic management permissions.

Permissions:

- View assigned courses.
- Upload course materials.
- Manage assigned students.
- Upload examination scores.
- View student performance.

### Student

The student has limited access.

Permissions:

- View personal profile.
- View registered courses.
- View examination results.
- Download learning materials.
- View announcements.

Our backend must enforce these permissions.

---

# 4. INTRODUCTION TO JSON WEB TOKEN (JWT)

JWT stands for JSON Web Token.

It is an open standard used to securely transmit information between parties as a digitally signed token.

In our application, JWT helps the backend recognize authenticated users when they make subsequent requests.

## 4.1 Why Do We Need JWT?

Consider this situation.

A student logs into the portal successfully.

The backend verifies the student's email and password.

What happens when the student navigates to the dashboard?

Should the student enter their email and password again?

No.

The application needs a way to remember that the student has already authenticated.

JWT provides a mechanism for doing this.

After successful login:

1. The backend generates a JWT.
2. The backend sends the token to the frontend.
3. The frontend receives the token.
4. The frontend sends the token with subsequent protected requests.
5. The backend verifies the token.
6. The backend allows or rejects the request.

This is the foundation of JWT authentication.

## 4.2 Is JWT the Same as a Password?

No.

A password is a credential used to authenticate a user.

A JWT is a signed token issued after successful authentication.

The password proves the user's identity during login.

The token allows the application to recognize that authenticated user during subsequent requests.

---

# 5. UNDERSTANDING THE JWT STRUCTURE

A JWT consists of three parts:

1. Header
2. Payload
3. Signature

These three parts are separated by full stops.

The structure is:

HEADER.PAYLOAD.SIGNATURE

Example:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.signature

## 5.1 Header

The header contains information about the token type and signing algorithm.

Example:

{
  "alg": "HS256",
  "typ": "JWT"
}

- alg represents the signing algorithm.
- typ identifies the token type.

## 5.2 Payload

The payload contains information about the user or other claims.

Example:

{
  "id": "672ab123",
  "iat": 1793700000,
  "exp": 1793700900
}

Explanation:

- id: The authenticated user's database ID.
- iat: The time the token was issued.
- exp: The time the token expires.

JWT payloads are encoded, not encrypted.

Never store passwords or sensitive information inside the payload.

## 5.3 Signature

The signature is generated using the header, payload, and secret key.

It helps the backend verify that the token has not been modified.

If someone changes the payload, the original signature will no longer validate.

## 5.4 JWT Signing and Verification

When generating a token, we use:

jwt.sign(payload, secret, options)

When verifying a token, we use:

jwt.verify(token, secret)

Both operations use the same secret when using a symmetric signing algorithm such as HS256.

---

# 6. UNDERSTANDING PASSWORD HASHING

Before implementing login, we need to understand how passwords are stored.

## 6.1 Why Should We Hash Passwords?

Imagine a student registers using this password:

student12345

Should we store the password directly inside MongoDB?

No.

If the database is compromised, attackers could obtain users' original passwords.

Instead, we use password hashing.

Password hashing converts a password into a one-way cryptographic hash.

Example:

Original password:

student12345

Hashed password:

$2b$12$some-long-hashed-value

The original password is not stored.

## 6.2 What Is Bcrypt?

Bcrypt is a password-hashing algorithm designed for securely storing passwords.

It provides:

- Password hashing.
- Salt generation.
- Configurable computational cost.
- Password comparison.

We will use the bcryptjs package.

## 6.3 Hashing a Password

Example:

import bcrypt from "bcryptjs";

const password = "student12345";

const hashedPassword = await bcrypt.hash(password, 12);

console.log(hashedPassword);

The number 12 represents the cost factor.

Higher cost factors require more computational work.

## 6.4 Comparing Passwords

During login, we use:

const isCorrect = await bcrypt.compare(
  submittedPassword,
  storedHashedPassword
);

The function returns:

true

or

false

We do not decrypt the password.

We compare the submitted password against the stored hash.

---

# 7. PROJECT REQUIREMENTS AND DEPENDENCIES

We will use the following technologies:

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modelling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation and verification |
| dotenv | Environment variable management |
| cors | Cross-Origin Resource Sharing |
| nodemon | Automatic server restarting |

## 7.1 Create the Project

Open your terminal.

Run:

mkdir student-portal-backend

Navigate into the project:

cd student-portal-backend

Initialize npm:

npm init -y

## 7.2 Install Dependencies

Run:

npm install express mongoose bcryptjs jsonwebtoken dotenv cors

Install nodemon:

npm install --save-dev nodemon

## 7.3 Configure package.json

Add:

{
  "name": "student-portal-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

### Understanding ES6 Modules

The "type": "module" configuration allows us to use ES6 import and export syntax.

Modern ES6 syntax:

import express from "express";

export default app;

Older CommonJS syntax:

const express = require("express");

module.exports = app;

We will use ES6 throughout this project.

---

# 8. PROJECT FOLDER STRUCTURE

Create the following folder structure:

student-portal-backend/

    config/
        db.js

    controllers/
        auth.controller.js

    middleware/
        auth.middleware.js
        ownership.middleware.js

    models/
        user.model.js

    routes/
        auth.routes.js
        dashboard.routes.js

    utils/
        generateToken.js

    .env
    .gitignore
    app.js
    server.js
    package.json

## Understanding the Folder Structure

### config/

Contains application configurations.

Example:

- Database connection.
- Third-party service configuration.

### controllers/

Contains application logic.

Controllers process requests, interact with models and return responses.

### middleware/

Contains reusable functions that execute during the request-response lifecycle.

Examples:

- Authentication middleware.
- Authorization middleware.
- Validation middleware.
- Error handling middleware.

### models/

Contains database schemas and models.

### routes/

Contains API endpoint definitions.

### utils/

Contains reusable helper functions.

### app.js

Initializes the Express application and registers middleware and routes.

### server.js

Connects to the database and starts the HTTP server.

---

# 9. CONFIGURING ES6 MODULES AND ENVIRONMENT VARIABLES

Create a `.env` file.

PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/student_portal

JWT_SECRET=your_generated_secret

JWT_EXPIRES_IN=15m

NODE_ENV=development

CLIENT_URL=http://localhost:5173

## What Is an Environment Variable?

An environment variable is a configuration value stored outside the application's source code.

It helps protect sensitive configuration and makes applications easier to configure across environments.

For example:

process.env.PORT

retrieves the PORT variable.

process.env.JWT_SECRET

retrieves the JWT secret.

Never expose JWT secrets or database credentials to the frontend.

## Create .gitignore

Add:

node_modules/
.env
.env.*
!.env.example

This prevents sensitive configuration files and installed dependencies from being committed to Git.

---

# 10. CONNECTING TO MONGODB

Create:

config/db.js

Code:

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;

## Explanation

### Import Mongoose

import mongoose from "mongoose";

Mongoose is an ODM (Object Data Modelling) library that allows Node.js applications to interact with MongoDB.

### Create an asynchronous function

const connectDB = async () => {}

Database operations are asynchronous.

We use async/await to handle the connection.

### Establish the connection

await mongoose.connect(process.env.MONGO_URI);

This connects the application to the MongoDB database.

### Error handling

try/catch allows us to handle connection errors.

process.exit(1) terminates the application if the database connection fails.

---

# 11. CREATING THE USER MODEL

Create:

models/user.model.js

A model defines how information should be structured and stored in MongoDB.

For our student portal, we need to store:

- Name
- Email
- Password
- Role
- Matriculation number
- Account status

Code:

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "lecturer", "student"],
      default: "student",
    },

    matricNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;

## Explanation of Important Concepts

### Schema

A schema defines the structure of documents stored in MongoDB.

### Required

required: true

Means that the field must be provided.

### Unique

unique: true

Creates a unique index so that duplicate values are rejected by MongoDB.

Note: Unique is an index constraint, not a Mongoose validation rule.

### Enum

enum: ["admin", "lecturer", "student"]

Restricts the role to approved values.

### Default

default: "student"

Automatically assigns the student role if no role is supplied.

### Select: false

select: false

Prevents the password from being returned in normal Mongoose queries.

When we need it during login, we explicitly request it.

### Timestamps

timestamps: true

Automatically creates:

- createdAt
- updatedAt

### toJSON

The toJSON transform removes sensitive information before the user document is returned as JSON.

---

# 12. UNDERSTANDING JWT SECRETS

A JWT secret is a private cryptographic string used to sign and verify JWT tokens.

It must be generated securely.

## 12.1 Generate a JWT Secret

Open your terminal and run:

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Node.js uses the crypto module to generate a cryptographically secure random value.

Copy the generated output.

## 12.2 Add It to .env

JWT_SECRET=paste_generated_secret_here

## 12.3 Why Do We Need a Secret?

The secret is used to digitally sign tokens.

During token generation:

jwt.sign(payload, process.env.JWT_SECRET)

During token verification:

jwt.verify(token, process.env.JWT_SECRET)

The same secret is required for both operations when using HS256.

If the secret is incorrect, token verification fails.

IMPORTANT:

- Never expose the JWT secret to React or another frontend application.
- Never commit it to GitHub.
- Use a strong, randomly generated value.
- Use a different secret for development and production.
- Rotate compromised secrets.

---

# 13. GENERATING JWT TOKENS

Create:

utils/generateToken.js

Code:

import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    }
  );
};

export default generateToken;

## Explanation

### Import JWT

import jwt from "jsonwebtoken";

This imports the JWT package.

### Create the function

const generateToken = (userId) => {}

The function accepts a user's database ID.

### Generate the token

jwt.sign()

The sign method creates a digitally signed JWT.

It accepts three arguments:

1. Payload.
2. Secret key.
3. Configuration options.

### Payload

{
  id: userId
}

We store the user's database ID in the token.

### Secret

process.env.JWT_SECRET

This retrieves the secret from the environment variables.

### Expiration

expiresIn: "15m"

This means the token expires after 15 minutes.

## What Happens When a Token Expires?

When the token expires, jwt.verify() rejects it.

The user must obtain a new access token.

In a production application, refresh tokens can be implemented to allow users to obtain new access tokens without repeatedly entering their passwords.

---

# 14. IMPLEMENTING USER REGISTRATION

Create:

controllers/auth.controller.js

Registration allows a new student to create an account.

Code:

import User from "../models/user.model.js";

import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      matricNumber,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create the student
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      matricNumber,
      role: "student",
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Return response
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: user.toJSON(),
    });

  } catch (error) {
    next(error);
  }
};

## Explanation of the Registration Process

### Step 1: Extract request data

const { name, email, password, matricNumber } = req.body;

The frontend sends registration information in the request body.

We use destructuring to extract the required values.

### Step 2: Validate required fields

if (!name || !email || !password)

This checks whether the required information has been provided.

### Step 3: Check for an existing account

const existingUser = await User.findOne({
  email: email.toLowerCase(),
});

This searches MongoDB for an existing user with the supplied email.

### Step 4: Hash the password

const hashedPassword = await bcrypt.hash(password, 12);

The original password is converted into a secure hash.

### Step 5: Create the user

const user = await User.create({...});

Mongoose creates a new user document in MongoDB.

### Step 6: Generate JWT

const token = generateToken(user._id);

A JWT is generated using the new user's database ID.

### Step 7: Return the response

res.status(201).json({...});

The backend returns the registration result, token and user information.

## Important Security Principle

Notice that we explicitly wrote:

role: "student"

We did not accept the role from req.body.

This prevents someone from registering as an administrator by submitting:

{
  "name": "Attacker",
  "email": "attacker@gmail.com",
  "password": "password123",
  "role": "admin"
}

Public registration must never allow users to assign themselves privileged roles.

Administrators and lecturers should be created through an authorized administrative process.

---

# 15. IMPLEMENTING USER LOGIN

Login allows an existing user to access the application.

Add this function to:

controllers/auth.controller.js

Code:

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and retrieve password
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    // Check whether user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return successful login response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });

  } catch (error) {
    next(error);
  }
};

## Explanation of the Login Process

### Step 1: Extract login credentials

const { email, password } = req.body;

The frontend sends the user's email and password.

### Step 2: Find the user

const user = await User.findOne({
  email: email.toLowerCase(),
}).select("+password");

We search MongoDB for the account.

Notice:

.select("+password")

Our password field has select: false in the schema.

We explicitly include it because we need it to compare passwords.

### Step 3: Verify that the account exists

if (!user)

If the account does not exist, login fails.

### Step 4: Compare passwords

const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

This compares the submitted password with the stored hash.

### Step 5: Generate JWT

const token = generateToken(user._id);

If the credentials are correct, a token is generated.

### Step 6: Return the response

The backend sends:

- Success message.
- JWT token.
- User information.

The frontend can now use the token for protected requests.

---

# 16. UNDERSTANDING TOKEN STORAGE

An important question is:

After the backend generates a JWT, where does the token go?

The answer is that the backend returns the token to the frontend.

The frontend decides how to store it.

## 16.1 How Does the Frontend Receive the Token?

Suppose the backend returns:

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "672ab123",
    "name": "John Doe",
    "email": "john@student.com",
    "role": "student"
  }
}

In React, we can access the response using:

const data = await response.json();

The token can be accessed through:

data.token

## 16.2 Storing the Token in localStorage

For a basic learning demonstration:

localStorage.setItem("token", data.token);

This saves the token in the browser's local storage.

To retrieve it:

const token = localStorage.getItem("token");

To remove it:

localStorage.removeItem("token");

## 16.3 Understanding localStorage

localStorage is a browser storage mechanism.

It allows developers to store key-value pairs in the browser.

Example:

localStorage.setItem("username", "John");

Retrieve:

localStorage.getItem("username");

Remove:

localStorage.removeItem("username");

## 16.4 Important Production Security Consideration

localStorage is accessible to JavaScript.

If an attacker successfully executes malicious JavaScript through an XSS vulnerability, they may steal tokens stored there.

For production applications, consider:

- Short-lived access tokens held in memory.
- Refresh tokens stored in Secure, HttpOnly cookies.
- Refresh-token rotation.
- Appropriate SameSite cookie settings.
- CSRF protection when required.
- Strong XSS prevention.

For this introductory lesson, localStorage helps demonstrate the token lifecycle. It should not automatically be treated as the recommended production architecture.

---

# 17. UNDERSTANDING HTTP AUTHORIZATION HEADERS

After receiving and storing the token, the frontend must send it to the backend when accessing protected resources.

This is done using the HTTP Authorization header.

## 17.1 What Is an HTTP Header?

HTTP headers provide additional information about a request or response.

Examples include:

Content-Type: application/json

Authorization: Bearer TOKEN

Accept: application/json

## 17.2 What Is the Authorization Header?

The Authorization header is used to send authentication credentials with an HTTP request.

For JWT authentication, we commonly use the Bearer authentication scheme.

Example:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Breakdown:

- Authorization: Header name.
- Bearer: Authentication scheme.
- Token: Actual JWT.

## 17.3 Sending the Token from React

Example:

const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/dashboard/student",
  {
    method: "GET",

    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();

console.log(data);

## Explanation

First, retrieve the token:

const token = localStorage.getItem("token");

Then send it in the request headers:

"Authorization": `Bearer ${token}`

The frontend is responsible for including the token in subsequent requests.

Express does not automatically insert it into the Authorization header.

## 17.4 Example of an HTTP Request

GET /api/dashboard/student HTTP/1.1

Host: localhost:5000

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Content-Type: application/json

This is what the backend receives.

---

# 18. HOW EXPRESS RETRIEVES THE TOKEN

Express provides request headers through:

req.headers

To access the Authorization header:

req.headers.authorization

Example:

const authorization = req.headers.authorization;

If the frontend sends:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

The value of:

req.headers.authorization

will be:

Bearer eyJhbGciOiJIUzI1NiIs...

## 18.1 Extracting the Actual Token

We use:

const token = req.headers.authorization.split(" ")[1];

Why?

Because split(" ") separates a string wherever it finds a space.

Example:

const authorization = "Bearer mytoken123";

console.log(authorization.split(" "));

Output:

[
  "Bearer",
  "mytoken123"
]

Therefore:

split(" ")[0] = Bearer

split(" ")[1] = Actual token

---

# 19. IMPLEMENTING AUTHENTICATION MIDDLEWARE

Create:

middleware/auth.middleware.js

Authentication middleware protects routes by verifying the JWT before allowing requests to proceed.

Code:

import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check whether token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find authenticated user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User is no longer authorized",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to next middleware
    next();

  } catch (error) {

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next(error);
  }
};

## 19.1 Explanation of Authentication Middleware

### Step 1: Extract the token

We inspect the Authorization header.

req.headers.authorization

### Step 2: Check for Bearer authentication

authorization.startsWith("Bearer ")

This confirms that the request uses the expected authentication scheme.

### Step 3: Extract the token

token = req.headers.authorization.split(" ")[1];

This removes the Bearer prefix.

### Step 4: Verify the JWT

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

The JWT library verifies the token signature and expiration.

If the token has been modified or has expired, verification fails.

### Step 5: Retrieve the user

const user = await User.findById(decoded.id);

We use the ID inside the verified token to find the corresponding user.

### Step 6: Attach user information to the request

req.user = user;

This is one of the most important lines in authentication middleware.

It attaches the authenticated user to the Express request object.

Subsequent controllers and middleware can access:

req.user._id

req.user.name

req.user.email

req.user.role

### Step 7: Call next()

next();

This tells Express to proceed to the next middleware or controller.

If authentication fails, the request is rejected.

## 19.2 Understanding HTTP Status Codes

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successful login |
| 201 | Created | Successful registration |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | User or route does not exist |
| 409 | Conflict | Duplicate email |
| 500 | Internal Server Error | Unexpected server failure |

IMPORTANT:

401 means authentication is missing or invalid.

403 means the user is authenticated but does not have permission to access the resource.

---

# 20. IMPLEMENTING AUTHORIZATION MIDDLEWARE

Authentication verifies identity.

Authorization determines permissions.

We will implement Role-Based Access Control (RBAC).

Add the following to:

middleware/auth.middleware.js

Code:

export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

## 20.1 Understanding the Code

### Rest Parameters

export const authorize = (...roles) => {}

The rest parameter allows a function to receive multiple arguments.

Example:

authorize("admin", "lecturer");

Inside the function:

roles = ["admin", "lecturer"]

### Checking User Permissions

roles.includes(req.user.role)

This checks whether the authenticated user's role exists in the permitted roles array.

For example:

authorize("admin")

Only administrators are allowed.

authorize("admin", "lecturer")

Both administrators and lecturers are allowed.

### Why Do We Need protect Before authorize?

Consider:

router.get(
  "/admin",
  protect,
  authorize("admin"),
  adminDashboard
);

The protect middleware runs first.

It verifies the JWT and attaches the authenticated user to req.user.

Then authorize checks the user's role.

Without protect, req.user may not exist.

Therefore, the order of middleware matters.

---

# 21. UNDERSTANDING RESOURCE OWNERSHIP

Role-based authorization is not always enough.

Consider two students:

Student A: John

Student B: Mary

Both have the role:

student

John should not be able to access Mary's private examination results.

However, a basic role check would allow both students because they have the same role.

We therefore need resource ownership checks.

## 21.1 What Is Resource Ownership?

Resource ownership ensures that users can access only resources they are permitted to access based on their relationship to those resources.

Example:

GET /api/results/USER_ID_123

The backend must establish whether the authenticated student owns the requested resource.

## 21.2 Implementing Ownership Middleware

Create:

middleware/ownership.middleware.js

Code:

export const checkOwnership = (paramName = "id") => {
  return (req, res, next) => {

    const resourceUserId = req.params[paramName];

    const isOwner =
      req.user._id.toString() === resourceUserId.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot access another user's resource",
      });
    }

    next();
  };
};

## Explanation

The middleware compares:

1. The ID of the authenticated user.
2. The ID of the requested resource owner.

If both IDs match, access is granted.

An administrator is also allowed.

Otherwise, the request is rejected.

IMPORTANT:

For resources such as student results, ownership should ideally be checked against the actual student ID stored on the result record, not merely the URL parameter.

A safer student-specific query is:

const results = await Result.find({
  student: req.user._id,
});

This prevents students from changing a URL ID to retrieve another student's results.

---

# 22. CREATING AUTHENTICATION ROUTES

Create:

routes/auth.routes.js

Code:

import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/auth.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);

router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getMe);

export default router;

## 22.1 Understanding express.Router()

express.Router() creates a modular routing system.

It allows us to organize routes into separate files instead of placing every route inside app.js.

## 22.2 Public Routes

router.post("/register", registerUser);

router.post("/login", loginUser);

These routes are public because users must be able to register and log in without already being authenticated.

## 22.3 Protected Routes

router.get("/me", protect, getMe);

This route uses the protect middleware.

Only authenticated users can access it.

---

# 23. IMPLEMENTING THE GET ME CONTROLLER

Add the following to:

controllers/auth.controller.js

Code:

export const getMe = async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
};

## What Does This Controller Do?

The /me endpoint retrieves information about the currently authenticated user.

It uses:

req.user._id

This information was attached to the request by the protect middleware.

The controller then queries MongoDB for that user.

The frontend can use this endpoint to retrieve the authenticated user's profile when loading the dashboard.

---

# 24. CREATING ROLE-BASED DASHBOARD ROUTES

Create:

routes/dashboard.routes.js

Code:

import express from "express";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin dashboard
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "Welcome to the Admin Dashboard",
      user: req.user,
    });

  }
);

// Lecturer dashboard
router.get(
  "/lecturer",
  protect,
  authorize("lecturer"),
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "Welcome to the Lecturer Dashboard",
      user: req.user,
    });

  }
);

// Student dashboard
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "Welcome to the Student Dashboard",
      user: req.user,
    });

  }
);

export default router;

## Understanding Middleware Execution

Consider:

router.get(
  "/admin",
  protect,
  authorize("admin"),
  adminDashboard
);

The request passes through:

1. Authentication middleware.
2. Authorization middleware.
3. Dashboard controller.

The controller only executes if both security checks pass.

This is called middleware chaining.

---

# 25. CONFIGURING THE EXPRESS APPLICATION

Create:

app.js

Code:

import express from "express";

import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Register API routes
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

// Default route
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Student Portal API is running",
  });

});

// Handle unknown routes
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});

// Global error handler
app.use((err, req, res, next) => {

  console.error(err);

  res.status(err.status || 500).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });

});

export default app;

## 25.1 Understanding app.use()

app.use() registers middleware or mounts routers into the Express application.

Consider:

app.use("/api/auth", authRoutes);

This means every route inside authRoutes is mounted under:

/api/auth

If auth.routes.js contains:

router.post("/login", loginUser);

The final endpoint becomes:

POST /api/auth/login

Similarly:

app.use("/api/dashboard", dashboardRoutes);

If dashboard.routes.js contains:

router.get("/student", ...);

The final endpoint becomes:

GET /api/dashboard/student

## 25.2 Why Do We Need a Root Route?

app.get("/", ...)

This creates a default endpoint.

When someone visits:

http://localhost:5000/

The server responds:

{
  "success": true,
  "message": "Student Portal API is running"
}

It is useful for checking whether the API is running.

It is optional.

## 25.3 What Is a 404 Handler?

The 404 handler catches requests that do not match any registered route.

Example:

GET /api/unknown

The backend responds with:

{
  "success": false,
  "message": "Route not found"
}

## 25.4 What Is Global Error Handling?

The error middleware handles errors passed through:

next(error)

It should be registered after the application's routes.

This provides a central location for handling unexpected errors.

---

# 26. STARTING THE EXPRESS SERVER

Create:

server.js

Code:

import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {

  try {

    await connectDB();

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });

  } catch (error) {

    console.error("Server startup failed:", error.message);

    process.exit(1);

  }

};

startServer();

## Understanding server.js

### Load environment variables

dotenv.config();

This makes environment variables available through process.env.

### Import Express application

import app from "./app.js";

We import the configured Express application.

### Import database connection

import connectDB from "./config/db.js";

### Start the server

app.listen(PORT, callback)

This starts the HTTP server and allows it to receive requests.

We connect to MongoDB before starting the server.

## Start the Application

Run:

npm run dev

Expected terminal output:

MongoDB Connected: 127.0.0.1

Server running on port 5000

The backend is now running.

---

# 27. TESTING AUTHENTICATION WITH POSTMAN

Postman is an API testing tool that allows developers to send HTTP requests and inspect server responses.

We will use Postman to test our authentication system.

## 27.1 Test User Registration

Method:

POST

Endpoint:

http://localhost:5000/api/auth/register

Select:

Body → raw → JSON

Request body:

{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "John12345",
  "matricNumber": "CSC/2026/001"
}

Expected response:

{
  "success": true,
  "message": "Registration successful",
  "token": "generated_jwt_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@student.com",
    "role": "student",
    "matricNumber": "CSC/2026/001"
  }
}

Expected status:

201 Created

## 27.2 Test User Login

Method:

POST

Endpoint:

http://localhost:5000/api/auth/login

Request body:

{
  "email": "john@student.com",
  "password": "John12345"
}

Expected response:

{
  "success": true,
  "message": "Login successful",
  "token": "generated_jwt_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@student.com",
    "role": "student"
  }
}

Expected status:

200 OK

Copy the token returned by the backend.

## 27.3 Test the /me Endpoint

Method:

GET

Endpoint:

http://localhost:5000/api/auth/me

Open the Authorization tab.

Select:

Type: Bearer Token

Paste the JWT token.

Click Send.

Expected response:

{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@student.com",
    "role": "student"
  }
}

## 27.4 Test the Student Dashboard

Method:

GET

Endpoint:

http://localhost:5000/api/dashboard/student

Authorization:

Bearer Token

Paste the student's JWT.

Expected response:

{
  "success": true,
  "message": "Welcome to the Student Dashboard"
}

## 27.5 Test the Admin Dashboard with a Student Token

Method:

GET

Endpoint:

http://localhost:5000/api/dashboard/admin

Use the student's JWT.

Expected response:

{
  "success": false,
  "message": "You do not have permission to access this resource"
}

Expected status:

403 Forbidden

This demonstrates that authentication alone does not grant access to every resource.

## 27.6 Test Without a Token

Try accessing:

GET /api/dashboard/student

Do not provide an Authorization header.

Expected response:

{
  "success": false,
  "message": "Not authorized. Please login."
}

Expected status:

401 Unauthorized

---

# 28. UNDERSTANDING THE COMPLETE AUTHENTICATION LIFECYCLE

Let's connect all the concepts.

## Registration Lifecycle

1. Student submits registration information.
2. Express receives the request.
3. Registration controller validates the information.
4. Backend checks whether the email already exists.
5. Bcrypt hashes the password.
6. Mongoose saves the user in MongoDB.
7. Backend generates a JWT.
8. Backend returns the token and user information.

## Login Lifecycle

1. Student submits email and password.
2. Express receives the request.
3. Login controller searches MongoDB.
4. Bcrypt compares the submitted password against the stored hash.
5. If the password is correct, JWT is generated.
6. Backend returns the token.
7. Frontend receives the token.
8. Frontend stores the token according to its authentication strategy.

## Protected Request Lifecycle

1. Student requests the dashboard.
2. Frontend retrieves the access token.
3. Frontend sends the token through the Authorization header.
4. Express receives the request.
5. Authentication middleware extracts the token.
6. JWT verifies the token.
7. Backend retrieves the authenticated user.
8. User information is attached to req.user.
9. Authorization middleware checks the user's role.
10. If permission is granted, the controller executes.
11. Backend returns the requested information.

## Visual Flow

CLIENT (React)
     |
     | 1. Submit email and password
     |
     v
EXPRESS BACKEND
     |
     | 2. Validate credentials
     |
     v
MONGODB
     |
     | 3. Retrieve user
     |
     v
BCRYPT
     |
     | 4. Compare passwords
     |
     v
JWT
     |
     | 5. Generate token
     |
     v
CLIENT (React)
     |
     | 6. Receive and store token
     |
     | 7. Send Authorization: Bearer TOKEN
     |
     v
AUTHENTICATION MIDDLEWARE
     |
     | 8. Extract and verify JWT
     |
     v
AUTHORIZATION MIDDLEWARE
     |
     | 9. Check user role and permissions
     |
     v
CONTROLLER
     |
     | 10. Execute requested operation
     |
     v
DATABASE / API RESPONSE

---

# 29. COMMON AUTHENTICATION ERRORS

## Error 1: jwt malformed

Possible cause:

The token supplied to jwt.verify() is not a valid JWT.

Solution:

Check that the frontend is sending the actual token rather than an undefined value or an entire response object.

## Error 2: invalid signature

Possible causes:

- The JWT secret used to sign the token differs from the verification secret.
- The token has been modified.
- An incorrect token was supplied.

Solution:

Check JWT_SECRET in your environment variables.

## Error 3: jwt expired

Cause:

The token has passed its expiration time.

Solution:

Implement refresh-token functionality or require the user to log in again.

## Error 4: req.user is undefined

Possible causes:

- protect middleware was not added.
- Middleware order is incorrect.
- Authentication middleware failed to attach the user.

Solution:

Ensure protect runs before authorize.

## Error 5: User password is undefined

Possible cause:

The password field has select: false in the schema.

Solution:

Use:

User.findOne({ email }).select("+password");

## Error 6: MongoDB connection failed

Possible causes:

- MongoDB is not running.
- Incorrect connection string.
- Database service is unavailable.

Solution:

Check your MongoDB connection and MONGO_URI.

## Error 7: 403 Forbidden

Cause:

The authenticated user's role does not have permission to access the requested resource.

Solution:

Check the role assigned to the account and the roles accepted by authorize().

---

# 30. SECURITY BEST PRACTICES

Authentication is a security-sensitive part of backend development.

The following practices should be considered when preparing an application for production.

## 30.1 Hash Passwords

Never store plain-text passwords.

Use bcrypt or another suitable password-hashing algorithm.

## 30.2 Protect Environment Variables

Never expose:

- JWT_SECRET
- MONGO_URI
- Database passwords
- API keys

## 30.3 Validate Request Data

Validate:

- Email addresses.
- Password length and strength.
- Required fields.
- User roles.
- Request parameters.

Consider using Zod or Joi.

## 30.4 Apply Rate Limiting

Limit repeated login attempts to reduce brute-force attacks.

Install:

npm install express-rate-limit

Example:

import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

app.use("/api/auth/login", loginLimiter);

## 30.5 Use Helmet

Install:

npm install helmet

In app.js:

import helmet from "helmet";

app.use(helmet());

Helmet sets HTTP security headers.

## 30.6 Use HTTPS

Production applications should use HTTPS to encrypt communication between the browser and backend.

## 30.7 Protect User Resources

Never assume that a student can access every resource simply because they are authenticated.

Check resource ownership.

## 30.8 Use Short-Lived Access Tokens

Access tokens should have a reasonable expiration time.

For example:

15m

Implement refresh-token rotation and revocation where appropriate.

## 30.9 Do Not Trust Frontend Roles

The frontend may hide or show dashboard options based on the user's role.

However, the backend must independently verify permissions on every protected operation.

Frontend authorization is not a substitute for backend authorization.

## 30.10 Use Secure Cookie Settings

For refresh tokens stored in cookies, consider:

- HttpOnly
- Secure
- SameSite

Implement CSRF protections appropriate to your cookie and deployment architecture.

---

# 31. CLASSROOM PRACTICAL EXERCISES

Students should complete the following exercises after the lecture.

## Exercise 1: Explain Authentication

In your own words, explain authentication.

Give two real-life examples.

## Exercise 2: Explain Authorization

Explain the difference between authentication and authorization.

Why does a student who successfully logs in still need permission checks?

## Exercise 3: Password Hashing

Write a JavaScript function that accepts a password and returns its bcrypt hash.

## Exercise 4: JWT Generation

Create a function that accepts a user ID and generates a JWT token with a 15-minute expiration time.

## Exercise 5: JWT Verification

Write middleware that extracts a JWT from the Authorization header and verifies it.

## Exercise 6: Role-Based Authorization

Create authorization middleware that allows only administrators and lecturers to access a particular endpoint.

## Exercise 7: Protected Route

Create a protected endpoint:

GET /api/profile

Only authenticated users should access it.

## Exercise 8: Student Dashboard

Create a student dashboard endpoint that only students can access.

## Exercise 9: Admin Dashboard

Create an admin dashboard endpoint that only administrators can access.

## Exercise 10: Postman Testing

Test the following situations:

1. Login with correct credentials.
2. Login with incorrect credentials.
3. Access a protected endpoint without a token.
4. Access a protected endpoint with an invalid token.
5. Access an admin route with a student token.
6. Access a student route with a valid student token.

Record the HTTP status codes and responses.

---

# 32. ASSESSMENT QUESTIONS

Answer the following questions.

### Multiple Choice Questions

**1. What is the primary purpose of authentication?**

A. Managing database records.

B. Verifying a user's identity.

C. Creating API routes.

D. Assigning database IDs.

**2. What does authorization determine?**

A. Whether a password is correct.

B. Whether a user exists.

C. What an authenticated user can access.

D. How a database connects.

**3. What does JWT stand for?**

A. Java Web Technology.

B. JSON Web Token.

C. JavaScript Web Transfer.

D. JSON Web Transfer.

**4. Which library is used for password hashing in this project?**

A. Express.

B. Mongoose.

C. bcryptjs.

D. dotenv.

**5. Which function generates a JWT?**

A. jwt.verify()

B. jwt.sign()

C. jwt.compare()

D. jwt.hash()

**6. Which function verifies a JWT?**

A. jwt.verify()

B. jwt.sign()

C. jwt.decodePassword()

D. jwt.create()

**7. Where should the JWT secret be stored?**

A. React component.

B. Public GitHub repository.

C. Backend environment variables.

D. HTML file.

**8. Which HTTP header commonly carries a JWT?**

A. Content-Type.

B. Authorization.

C. Accept.

D. Host.

**9. What does Bearer mean in the Authorization header?**

A. The user's role.

B. The authentication scheme.

C. The database password.

D. The JWT secret.

**10. Which Express property contains incoming request headers?**

A. req.body.

B. req.params.

C. req.headers.

D. res.headers.

**11. What does req.user represent in our authentication middleware?**

A. The currently authenticated user.

B. The database administrator.

C. The frontend user object.

D. The JWT secret.

**12. Which HTTP status code indicates that authentication is required or invalid?**

A. 200.

B. 201.

C. 401.

D. 500.

**13. Which status code indicates insufficient permissions?**

A. 200.

B. 400.

C. 401.

D. 403.

**14. What does express.Router() create?**

A. Database connection.

B. Modular router.

C. JWT token.

D. Password hash.

**15. Why should users not be allowed to select their own admin role during public registration?**

A. To improve website speed.

B. To prevent privilege escalation.

C. To reduce database size.

D. To generate tokens faster.

### Theory Questions

1. Explain authentication and authorization with practical examples.
2. Explain the three parts of a JWT.
3. Why is password hashing important?
4. Explain the difference between bcrypt.hash() and bcrypt.compare().
5. What is the purpose of a JWT secret?
6. Explain how a JWT gets from the backend to the frontend.
7. Explain how the frontend sends a JWT to Express.
8. What is the purpose of authentication middleware?
9. Why must protect run before authorize?
10. Explain the difference between 401 Unauthorized and 403 Forbidden.
11. What is resource ownership?
12. Explain the purpose of req.user.
13. Why should JWT secrets never be exposed to the frontend?
14. Why is frontend role checking insufficient for security?
15. Explain the complete JWT authentication lifecycle.

---

# 33. TAKE-HOME ASSIGNMENT: BUILD A STUDENT PORTAL AUTHENTICATION SYSTEM

Build a functional authentication system using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv

## Project Requirements

### A. User Registration

Implement:

POST /api/auth/register

The system should:

1. Accept a user's name.
2. Accept an email address.
3. Accept a password.
4. Hash the password.
5. Save the user in MongoDB.
6. Assign the student role by default.
7. Return a JWT after successful registration.

### B. User Login

Implement:

POST /api/auth/login

The system should:

1. Accept email and password.
2. Find the user.
3. Compare passwords.
4. Generate a JWT.
5. Return user information and the token.

### C. Authentication Middleware

Implement:

protect

The middleware must:

1. Retrieve the token from the Authorization header.
2. Extract the Bearer token.
3. Verify the token.
4. Retrieve the user.
5. Attach the user to req.user.
6. Reject invalid or expired tokens.

### D. Authorization Middleware

Implement:

authorize()

The middleware should support:

- Admin.
- Lecturer.
- Student.

### E. Protected Endpoints

Create:

GET /api/dashboard/admin

GET /api/dashboard/lecturer

GET /api/dashboard/student

Each endpoint should only be accessible to its respective role.

### F. Testing

Use Postman to test all endpoints.

Submit:

1. Your GitHub repository.
2. Your project folder structure.
3. Screenshots of successful registration.
4. Screenshots of successful login.
5. Screenshots of successful student dashboard access.
6. Screenshots of rejected unauthorized requests.
7. A short explanation of how your JWT authentication system works.

---

# 34. SUMMARY

In this lecture, we learned how to implement authentication and authorization in an Express.js application.

The major concepts covered include:

| Concept | Purpose |
|---|---|
| Authentication | Verifies user identity |
| Authorization | Controls user permissions |
| JWT | Represents a signed authentication token |
| JWT Secret | Signs and verifies tokens |
| Bcrypt | Hashes and compares passwords |
| Mongoose | Manages MongoDB documents |
| Middleware | Processes requests before controllers |
| protect | Verifies authentication |
| authorize | Checks user roles |
| req.user | Stores the authenticated user on the request |
| Authorization Header | Carries the Bearer token |
| Resource Ownership | Restricts access to resources based on ownership |

## The Five Most Important Things to Remember

**1. Authentication answers: Who are you?**

It verifies the identity of the user.

**2. Authorization answers: What are you allowed to do?**

It determines what resources the user can access.

**3. Passwords must be hashed.**

Never store plain-text passwords in your database.

**4. JWT allows authenticated requests.**

The backend generates the token, the frontend receives it, and the frontend sends it back through the Authorization header.

**5. Middleware protects your API.**

Authentication middleware verifies the token, while authorization middleware checks the user's permissions.

---

# FINAL CLASSROOM TAKEAWAY

A secure backend does not simply check whether a user has logged in.

It must also verify that the user is allowed to perform the requested operation and access the requested resource.

In our Student Portal Backend:

- JWT establishes the authenticated identity.
- Bcrypt protects stored passwords.
- Authentication middleware verifies the JWT.
- Authorization middleware checks user roles.
- Ownership checks protect individual student resources.
- Controllers execute the permitted operations.

Together, these concepts form the foundation of secure backend development with Express.js.

**Next Lecture:** Building User Management and Course Management APIs with Express.js, MongoDB, Mongoose, Authentication and Role-Based Authorization.