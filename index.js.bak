const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());
morgan.token("person", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) return res.status(404).json({ error: "person not found" });
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const cek = persons.find((p) => p.id === id);
  if (!cek) return res.status(404).json({ error: "person not found" });
  persons = persons.filter((p) => p.id !== id);
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "missing name or number" });

  if (persons.find((p) => p.name === body.name))
    return res.status(400).json({ error: "name must be unique" });

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000),
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
