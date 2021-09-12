const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
      me: async (_, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('books');
        }
        throw new AuthenticationError("You need to be logged in!");
      },
    },

    Mutation: {
        login: async (_, { email, password }) => {
          const user = await User.findOne({ email });
    
          if (!user) {
            throw new AuthenticationError("Invalid login details");
          }
    
          const correctPw = await user.isCorrectPassword(password);
    
          if (!correctPw) {
            throw new AuthenticationError("Invalid login details");
          }
    
          const token = signToken(user);
          return { token, user };
        },

        addUser: async (_, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
      
            const token = signToken(newUser);
            return { token, newUser };
          },

          saveBook: async (parent, { input }, context) => {
            if (context.user) {
              const updateBookList = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
              );
              return updateBookList;
            }
            throw new AuthenticationError("You need to be signed in");
          },

          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updateBookList = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
              );
              return updateBookList;
            }
            throw new AuthenticationError("You need to be signed in");
          },
        },
      };
      module.exports = resolvers;