import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

// DB Configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "*******",
  port: 5432
});

// DB Connected
db.connect();

// MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

// Home Page Route
app.get("/", async (req, res) => {
  const items = await db.query("SELECT * FROM items ORDER BY id ASC");
  

  res.render("index.ejs", {
    listTitle: "AMAN's TO DO LIST",
    listItems: items.rows,
  });
});

// Add a New TO DO
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES($1)",[item]);
  res.redirect("/");
});

// Edit a TO DO
app.post("/edit", async (req, res) => {
  const updatedItemID = req.body.updatedItemId;
  const updatedTitle = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedTitle, updatedItemID]);
  res.redirect("/");


});

// DELETE a TO DO
app.post("/delete", async (req, res) => {
const deleteItemID = req.body.deleteItemId;
console.log(req.body);
await db.query("DELETE FROM items WHERE id = $1",[deleteItemID]);
res.redirect("/");


});

// We are Listening to Port: 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
