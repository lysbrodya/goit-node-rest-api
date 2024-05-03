import mongoose from "mongoose";

const DB_URI = `mongodb+srv://Uzerdata:Uzerdata@cluster0.rdgn861.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
  try {
    await mongoose.connect(DB_URI);
    // await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(" You successfully connected to MongoDB!");
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => console.error(error));
