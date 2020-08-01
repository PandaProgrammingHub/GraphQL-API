const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 3000;

//bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const events = [];

//graphql
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type Event{
        _id: ID!,
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }
    type RootQuery {
        events: [Event!]!
    }
    input EventInput {
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }
    type RootMutation {
        createEvent(eventInput: EventInput) : Event
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        console.log('event:', event);
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`App listening on port ${port}!`));
