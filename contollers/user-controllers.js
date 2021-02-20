import { handleError } from '../lib/handlerror.js';
import User from '../service/schema/user-schema.js';
import bCrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function listUser(_req, res) {
  try {
    const user = await User.find();

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        total: user.length,
        user,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

async function createUser(req, res) {
  const data = req.body;

  const password = bCrypt.hashSync(data.password, bCrypt.genSaltSync(6));
  const newUser = { ...data, password: password };

  try {
    const user = await User.create(newUser);

    return res.status(201).json({
      Status: 'Created',
      code: 201,
      'Content-Type': 'application/json',
      ResponseBody: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        Status: 'Conflict',
        code: 409,
        'Content-Type': 'application/json',
        ResponseBody: {
          message: 'Email in use',
        },
      });
    }
    handleError(error);
  }
}

async function login(req, res) {
  const userData = req.body;
  const secret = process.env.secret;

  try {
    const { _id, email, password, subscription } = await User.findOne({
      email: userData.email,
    });
    const authentication = bCrypt.compareSync(userData.password, password);

    if (!authentication) {
      return res.status(401).json({
        Status: 'Unauthorized',
        code: 401,
        ResponseBody: 'Email or password is wrong',
      });
    }

    if (authentication) {
      const token = jwt.sign({ _id, email }, secret);

      return res.status(200).json({
        Status: 'OK,',
        'Content-Type': 'application/json',
        ResponseBody: {
          token: token,
          user: {
            email: email,
            subscription: subscription,
          },
        },
      });
    }
  } catch (error) {
    console.log(error.code);
    handleError(error);
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: 'Not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: { user },
    });
  } catch (error) {
    handleError(error);
  }
}

async function removeUser(req, res) {
  try {
    const { userId } = req.params;

    const deletedData = await User.deleteOne({ _id: userId });

    if (deletedData.n === 0) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: `Id: ${userId} not found.`,
        data: 'Bad request.',
      });
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: `User with id: ${userId} deleted`,
      deletedData: deletedData.deletedCount,
    });
  } catch (error) {
    handleError(error);
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { body } = req;

    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send(`ID: ${userId} not found.`);
    }

    return res.json({
      status: 'access',
      code: 200,
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

export default {
  listUser,
  getUserById,
  createUser,
  login,
  removeUser,
  updateUser,
};
