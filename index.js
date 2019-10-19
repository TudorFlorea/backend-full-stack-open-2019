require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./db");

db.connect();
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectJd") {
    return res.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

morgan.token("content", req => {
  if (!req.body) return "";
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

app.get("/api/persons", (req, res) => {
  // res.json(persons);
  Person.find({}).then(docs => {
    res.json(docs);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter(person => person.id === id);

  if (person.length < 1) {
    res.status(404).json({
      error: `Person with the id ${id} doesn't exist in the database`
    });
  } else {
    res.json(person[0]);
  }
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name) {
    res.status(400).json({
      error: "The request body is missing the 'name' property"
    });
    return;
  }
  if (!req.body.number) {
    res.status(400).json({
      error: "The request body is missing the 'number' property"
    });
    return;
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });

  person
    .save()
    .then(personDoc => {
      res.json(personDoc.toJSON());
    })
    .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(personDoc => {
      if (personDoc) {
        res.json(personDoc.toJSON());
      } else {
        res.status(204).end();
      }
    })
    .catch(err => next(err));
});

app.get("/info", (req, res) => {
  res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App runing on port ${PORT}`);
});
