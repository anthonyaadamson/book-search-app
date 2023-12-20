const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw AuthenticationError;
    },
  },
  Mutations: {
    addUser: async (parent, { body }) => {
      const user = await User.create({ body });
      const token = signToken(user);
      return { token, user };
    },

    // WIP not sure if this is the correct way to go about passin gin the email, username and password.
    login: async (parent, { email, username, password }) => {
      const user = await User.findOne({ email, password });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPass = await user.isCorrectPassword(password);
      if (!correctPass) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    // WIP.. Update save book to take in book author's array, description, title, BookId, image and link as parameters.
    saveBook: async (parent, { user, body }, context) => {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { books: book._id } }
        );

        return User;
    },
    removeBook: async (parent, { BookId }, context) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: bookId,
          username: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { books: book._id } }
        );

        return User;
      }
      throw AuthenticationError;
    },
  }
};