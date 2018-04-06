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

// parseMessage example:
// input: "test" =>
// output: [
//   {
//     type: 'p',
//     content: [
//       {
//         type: 'text',
//         content: 'test'
//       }
//     ]
//   }
// ]

/**
 * Return the chunk(s) as an array.
 * @param {Array|string} chunks
 * @returns {Array} the resulting array
 */
const splitIntoChunks = chunks => (Array.isArray(chunks) ? chunks : [chunks]);

/**
 * Compose an endpoint.
 * @param {Object|string} message
 * @returns {Object} a message object
 */
const messageToObject = message => {
  switch (typeof message) {
    case "string":
      return {
        type: "p",
        content: message
      };
    case "object":
      return message;
    default:
      return message;
  }
};

/**
 * Compose a paragraph array from a string, paragraph object, or mixed array of strings and paragraph objects.
 * @param {Array|Object|string} par
 * @returns {Array} an array of paragraph objects with inline text and anchors
 */
const parsePar = par => {
  return splitIntoChunks(par).map(item => {
    switch (typeof item) {
      case "string":
        return {
          type: "text",
          content: item
        };
      case "object":
        return item;
      default:
        return item;
    }
  });
};

const parseJSON = test => {
  try {
    JSON.parse(test);
  } catch (e) {
    return test;
  }
  return JSON.parse(test);
};

/**
 * Compose a message array from any combination of strings, paragraph objects/arrays, and message objects.
 * @param {Array|Object|string} message
 * @returns {Array} an array of message objects
 */
const parseMessage = message => {
  return splitIntoChunks(parseJSON(message))
    .map(messageToObject)
    .map(messageObject => {
      switch (messageObject.type) {
        case "h":
          return messageObject;
        case "a":
          return messageObject;
        case "p":
          return {
            type: "p",
            content: parsePar(messageObject.content)
          };
        default:
          return messageObject;
      }
    });
};

module.exports = {
  splitIntoChunks,
  messageToObject,
  parsePar,
  parseMessage
};
