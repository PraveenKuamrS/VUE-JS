// const express = require('express');
// const app = express()
// const mongoose =require('mongoose')
// mongoose.set('strictQuery',false);
// var routes=require('./route/routes');
// const cors=require('cors');



// app.use(cors(
//   {
//     origin:"http://localhost:8080"
//   }
// ));




// app.listen(9992,function check(err)
// {
//     if (err)
//         console.log("Error .... |||");
//     else
//         console.log("started");
    
// });



// async function connectToDatabase() {
//     try {
//       await mongoose.connect('mongodb://127.0.0.1:27017/abc', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       });
//       console.log('Successfully connected to the database');
//     } catch (error) {
//       console.log('Error connecting to the database:', error);
//     }
//   }
  
//   connectToDatabase();

//   app.use(express.json());
//   app.use(routes);


//THE BELOW CODE SNED MESSAGE WELLL TO CLIENT AND RESPONSE WELL

// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
// const routes = require('./route/routes');
// const cors = require('cors');

// app.use(cors());

// app.use(express.json());
// app.use(routes);

// // Step 2: Socket.IO integration
// const http = require('http').Server(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: 'http://localhost:8080',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('message', (message) => {
//     console.log('Received message:', message); // Print the received message
//     io.emit('message', message);

//     // Send acknowledgment to the admin panel
//     socket.emit('messageAck', message);
//   });

//   socket.on('messageViewed', (messageId) => {
//     // Handle message viewed logic here
//     console.log('Message viewed from flutter:', messageId);

//     // Emit 'messageViewedAck' event to the admin panel
//     socket.emit('messageViewedAck', messageId);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });


// const port = 9992;

// async function connectToDatabase() {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/abc', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Successfully connected to the database');
//   } catch (error) {
//     console.log('Error connecting to the database:', error);
//   }
// }

// connectToDatabase();

// http.listen(port, () => {
//   console.log('Server started on port', port);
// });


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
mongoose.set('strictQuery', false);
const routes = require('./route/routes');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(routes);

// Step 2: Socket.IO integration
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message);

    // Send acknowledgment to the admin panel
    socket.emit('messageAck', message);
  });

  socket.on('images', async (files) => {
    const savedImages = [];
    for (const file of files) {
      const fileId = uuidv4();
      const fileName = `${fileId}_${file.name}`;
      const filePath = path.join(__dirname, 'uploads', fileName);

      // Save the original image file
      await fs.promises.writeFile(filePath, file.data);

      console.log('Successfully saved in uploads folder:', fileName);

      // Read the saved image file and encode it to base64
      const imageData = fs.readFileSync(filePath, { encoding: 'base64' });

      // Save the image information in your database or perform other operations
      savedImages.push({
        id: fileId,
        name: file.name,
        data: imageData,
      });
    }

    // Emit the saved images to all clients
    io.emit('imageData', savedImages);
  });

  socket.on('messageViewed', (messageId) => {
    // Handle message viewed logic here
    console.log('Message viewed:', messageId);

    // Emit 'messageViewedAck' event to the admin panel
    socket.emit('messageViewedAck', messageId);
  });

  socket.on('imageDownloaded', (imageId) => {
    console.log('Client downloaded image:', imageId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = 9992;

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/abc', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to the database');
  } catch (error) {
    console.log('Error connecting to the database:', error);
  }
}

connectToDatabase();

http.listen(port, () => {
  console.log('Server started on port', port);
});
