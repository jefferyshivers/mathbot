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

import {
  splitIntoChunks,
  messageToObject,
  parsePar,
  parseMessage
} from "./messageParser.js";

describe("splitIntoChunks", () => {
  it("returns an array if given, or a new array with the argument", () => {
    const not_array = "test";
    const array = ["test"];

    expect(splitIntoChunks(not_array)).to.deep.equal(array);
    expect(splitIntoChunks(array)).to.deep.equal(array);
  });
});

describe("messageToObject", () => {
  it("returns an object if given, or a new object with the given value set to a property", () => {
    const not_an_object = "test";
    const an_object = {
      type: "p",
      content: "test"
    };
    const a_bad_object_but_still_an_object = {
      foo: "bar"
    };

    expect(messageToObject(not_an_object)).to.deep.equal(an_object);
    expect(messageToObject(an_object)).to.deep.equal(an_object);
    expect(messageToObject(a_bad_object_but_still_an_object)).to.deep.equal(
      a_bad_object_but_still_an_object
    );
  });
});

describe("parsePar", () => {
  it("takes an array or object and returns an array of new objects with similar properties", () => {
    const just_a_string = "test";
    expect(parsePar(just_a_string)).to.deep.equal([
      { type: "text", content: "test" }
    ]);
    expect(parsePar([just_a_string])).to.deep.equal([
      { type: "text", content: "test" }
    ]);

    const p_object = { type: "p", content: "foo" };
    expect(parsePar(p_object)).to.deep.equal([p_object]);
    expect(parsePar([p_object])).to.deep.equal([p_object]);

    const mixed_array = [
      "bar",
      { type: "text", content: "baz" },
      { type: "a", href: "www.com", content: "link" }
    ];
    expect(parsePar(mixed_array)).to.deep.equal([
      { type: "text", content: "bar" },
      { type: "text", content: "baz" },
      { type: "a", href: "www.com", content: "link" }
    ]);
  });
});

describe("parseMessage", () => {
  it("takes a string, object or array and returns a valid message object array", () => {
    const input = "test";
    const output = [
      { type: "p", content: [{ type: "text", content: "test" }] }
    ];
    expect(parseMessage(input)).to.deep.equal(output);

    const complex_input = [
      "another test",
      { type: "p", content: "foo" },
      {
        type: "p",
        content: [
          { type: "text", content: "a paragraph with a" },
          { type: "a", href: "www.com", content: "link" }
        ]
      }
    ];
    const complex_input_output = [
      {
        type: "p",
        content: [{ type: "text", content: "another test" }]
      },
      {
        type: "p",
        content: [{ type: "text", content: "foo" }]
      },
      {
        type: "p",
        content: [
          { type: "text", content: "a paragraph with a" },
          { type: "a", href: "www.com", content: "link" }
        ]
      }
    ];
    expect(parseMessage(complex_input)).to.deep.equal(complex_input_output);
  });
});
