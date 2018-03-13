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

import { composeEndpoint, isValid, areValid, chat } from "./index.js";
import sinon from "sinon";

const jsonOK = body => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-type": "application/json"
    }
  });

  return Promise.resolve(mockResponse);
};

describe("composeEndpoint", () => {
  it("Should compose an absolute endpoint", () => {
    let endpoint = composeEndpoint({ base: "base.com", path: "path" });

    expect(endpoint).to.equal("base.com/path");
  });

  it("Should compose a relative endpoint", () => {
    let endpoint = composeEndpoint({ path: "path" });

    expect(endpoint).to.equal("/path");
  });

  it("Should not compose an endpoint without a path", () => {
    let endpointA = composeEndpoint.bind(composeEndpoint, { base: "base.com" });
    let endpointB = composeEndpoint.bind(composeEndpoint, {});

    expect(endpointA).to.throw(Error, "Missing path in arguments");
    expect(endpointB).to.throw(Error, "Missing path in arguments");
  });
});

describe("isValid", () => {
  it("Should return true by default", () => {
    expect(isValid({})).to.be.true;
  });

  it("Should validate if {test} is of {type}", () => {
    let valid = isValid({ test: "a string", type: "string" });
    let invalid = isValid({ test: 1, type: "string" });

    expect(valid).to.be.true;
    expect(invalid).to.be.false;
  });

  it("Should validate if {test} is one of {choices}", () => {
    let valid = isValid({ test: "A", choices: ["A", "B"] });
    let invalid = isValid({ test: "A", choices: ["B", "C"] });

    expect(valid).to.be.true;
    expect(invalid).to.be.false;
  });
});

describe("areValid", () => {
  it("Should return true by default", () => {
    expect(areValid([])).to.be.true;
  });

  it("Should validate an array of validations", () => {
    let validType = { test: "a string", type: "string" };
    let invalidType = { test: 1, type: "string" };
    let validChoice = { test: "A", choices: ["A", "B"] };
    let invalidChoice = { test: "A", choices: ["B", "C"] };

    expect(areValid([validType, validChoice])).to.be.true;
    expect(areValid([validType, validChoice, invalidType])).to.be.false;
    expect(areValid([invalidType, invalidChoice])).to.be.false;
  });
});

describe("chat", () => {
  let newChat = chat({
    base: "https://base.com",
    path: "path",
    callback: data => {
      return {
        response: "hi back"
      };
    }
  });
  let message = {};
  sinon.stub(window, "fetch").returns(jsonOK(message));

  it("Should throw an error if given invalid properties", async () => {
    message = {};

    expect(newChat.bind(newChat, message)).to.throw(
      Error,
      "Invalid properties given in chat invocation"
    );
  });

  it("Should return callback with valid properties", async () => {
    message = {
      type: "string",
      message: "hi"
    };

    return newChat(message).then(result => {
      expect(result.response).to.deep.equal("hi back");
    });
  });
});
