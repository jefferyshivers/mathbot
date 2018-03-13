/**
 * The MIT License
 *
 * Copyright 2018 Jeffery Shivers.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Throw an error.
 * @param {string} message
 * @returns {Error} a new error
 */
const error = message => {
  throw Error(message);
};

/**
 * Compose an endpoint.
 * @param {Object} inputs
 * @param {string} [inputs.base] the base of the path if it is absolute
 * @param {string} inputs.path the path after base
 * @returns {string|Error} a string with the composed endpoint, or an error
 */
const composeEndpoint = ({ base, path }) => {
  if (path) return `${base || ""}/${path}`;

  throw Error("Missing path in arguments");
};

/**
 * Validate a property.
 * @param {Object} inputs
 * @param {} inputs.test the property being tested
 * @param {string} [inputs.type] the valid type of test
 * @param {Array} [inputs.choices] a list of valid values of test
 * @returns {boolean} whether the property is valid or not
 */
const isValid = ({ test, type, choices }) =>
  (type && typeof test !== type) || (choices && !choices.includes(test))
    ? false
    : true;

const areValid = validations => validations.every(isValid);

const chat = ({ base, path, callback }) => ({
  type,
  meta = {},
  message = ""
}) => {
  if (
    !areValid([
      {
        test: type,
        type: "string",
        choices: ["string", "number"]
      },
      {
        test: meta,
        type: "object"
      },
      {
        test: message,
        type: "string"
      }
    ])
  )
    throw Error("Invalid properties given in chat invocation");

  const endpoint = composeEndpoint({ base, path });

  if (callback) {
    return fetch(endpoint, { method: "POST" })
      .then(res => res.json())
      .then(data => callback(data));
  }
};

module.exports = {
  error,
  composeEndpoint,
  isValid,
  areValid,
  chat
};
