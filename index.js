require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Persons = require("./models/persons");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static("build"));
app.use(cors());
morgan.token("person", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.get("/api/persons", (req, res) => {
  Persons.find({}).then((person) => res.json(person));
});

app.get("/api/persons/:id", (req, res, next) => {
  Persons.findById(req.params.id)
    .then((person) =>
      person
        ? res.json(person)
        : res.status(404).send({ error: "person not found" })
    )
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Persons.findByIdAndRemove(req.params.id)
    .then((p) => {
      return p
        ? res.status(204).end()
        : res.status(404).send({ error: "person not found" });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "missing name or number" });

  const person = new Persons({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((p) => res.json(p))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };
  Persons.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) =>
      updatedPerson
        ? res.json(updatedPerson)
        : res.status(404).send({ error: "person not found in database" })
    )
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Persons.find({}).then((result) => {
    const info = `
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date().toString()}</p>
    `;
    res.send(info);
  });
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });
  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
