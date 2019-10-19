const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstackopen-vzp34.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);
console.log("gete");

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name,
    number
  });
  person.save(doc => {
    console.log("person saved");
    mongoose.connection.close();
  });
} else {
  console.log(
    "Worng number of arguments. Use 'node mongo.js password' to print the persons or 'node mongo.js passowrd name number' to add an entry to the database"
  );
  mongoose.connection.close();
}
