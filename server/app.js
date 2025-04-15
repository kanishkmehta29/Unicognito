require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const connectDB = require("./connectdb.js");
var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const socket = require('socket.io');
const { spawn } = require('child_process');

const authRouter = require("./auth/auth.js");
const ProfileRoutes = require("./Routes/profileRoutes.js");
const discussionRoutes = require("./Routes/discussionRoutes.js");
const courseReviewRoutes = require("./Routes/courseReviewRoute.js");
const commentRoutes = require("./Routes/commentRoutes.js");
const postRoutes = require("./Routes/postRoutes.js");
const projectRoutes = require("./Routes/projectRoutes.js");
const messagesRoutes = require("./Routes/messagesRoute.js");
const groupRoutes = require("./Routes/groupRoutes.js");
const communityRoutes = require("./Routes/communityRoutes.js");
const tagRoutes = require('./Routes/tagRoutes');


var app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: "your_secret_value_here",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function (req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash("error_msg");

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash("error");
  for (var i in errs) {
    res.locals.error.push({ message: "An error occurred", debug: errs[i] });
  }

  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "auth/public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/profile", ProfileRoutes);
app.use("/auth", authRouter);
app.use("/discussion", discussionRoutes);
app.use("/coursereview", courseReviewRoutes);
app.use("/comment", commentRoutes);
app.use("/posts", postRoutes);
app.use("/projects", projectRoutes);
app.use("/messages", messagesRoutes);
app.use("/groups", groupRoutes);
app.use("/communities", communityRoutes);
app.use('/tags', tagRoutes);

// Function to execute Python script and capture its output
// The /evaluate-comment endpoint (update the existing one)
app.post('/evaluate-comment', (req, res) => {
  // Extract comment text from request body
  const commentText = req.body.comment;
  
  if (!commentText) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  // Path to Python script and arguments
  const scriptPath = path.join(__dirname, '../model/model.py');
  const args = [commentText]; // Pass the comment text as an argument

  console.log('Running Detoxify analysis on:', commentText.substring(0, 50) + '...');

  // Execute Python script with Detoxify
  getPythonOutput(scriptPath, args)
    .then((output) => {
      console.log('Detoxify output:', output);
      let hr, sr;
      
      try {
        const parts = output.split(',');
        hr = parseFloat(parts[0]);
        sr = parseFloat(parts[1]);
        
        if (isNaN(hr) || isNaN(sr)) {
          throw new Error('Invalid output format');
        }
        
        const response = {
          HateRating: hr,
          SpamRating: sr,
          allowed: hr < 50 && sr < 50 // Add an "allowed" flag for easier frontend handling
        };
        
        console.log('Comment evaluation result:', response);
        res.status(200).json(response);
      } catch (error) {
        console.error('Error parsing Detoxify output:', error);
        console.error('Raw output:', output);
        res.status(500).json({ error: 'Error parsing output', details: output });
      }
    })
    .catch((error) => {
      console.error('Error executing Detoxify script:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    });
});

// Improved function to execute Python script and capture its output
function getPythonOutput(scriptPath, args) {
  console.log('Arguments:', args);
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    let output = '';
    let errorOutput = '';
    
    // Capture standard output
    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      console.log('Python stdout:', dataStr);
      output += dataStr;
    });
    
    // Capture error output
    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      console.error('Python stderr:', dataStr);
      errorOutput += dataStr;
    });
    
    // Handle Python process exit
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      
      if (code === 0) {
        try {
          // Look for the tuple pattern (x, y) in the output
          const regex = /\(([^,]+),\s*([^)]+)\)/;
          const matches = regex.exec(output);
          
          if (matches && matches.length > 2) {
            const hateRating = parseFloat(matches[1]);
            const spamRating = parseFloat(matches[2]);
            resolve(`${hateRating},${spamRating}`);
          } else {
            // If no tuple format found, return the raw output
            resolve(output.trim());
          }
        } catch (err) {
          reject(new Error(`Failed to parse Python output: ${err.message}\nRaw output: ${output}`));
        }
      } else {
        reject(new Error(`Python process exited with code ${code}. Error: ${errorOutput}`));
      }
    });
    
    // Handle errors from Python process
    pythonProcess.on('error', (err) => {
      console.error('Error executing Python process:', err);
      reject(err);
    });
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

connectDB();

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${process.env.PORT || 3001}`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.msg);
    }
  })
})

module.exports = app;