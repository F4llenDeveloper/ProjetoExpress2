const { Schema } = require("mongoose");

const p = {
  string: { type: String, required: true },
  number: { type: Number, required: true },
  boolean: { type: Boolean, required: true },
  date: { type: Date, required: true },
  array: { type: Array, required: true },
};

const channel = new Schema({ id: p.string }, { _id: false });
const role = new Schema({ id: p.string }, { _id: false });

const mergeOptions = (defaultOptions, customOptions) => {
  return Object.assign({}, defaultOptions, customOptions);
};

const baseSchema = {
  ...p,
  channel,
  role,
  mergeOptions,
};

module.exports = baseSchema;