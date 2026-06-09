// Connect to MongoDB first, then start the server
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
.then(() => {
  console.log("MongoDB Connected Successfully! 🎉");
  
  // Server only starts listening after DB is ready
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
})
.catch(err => {
  console.error("MongoDB Connection Error: ", err);
});
