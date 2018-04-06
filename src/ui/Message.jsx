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

import React, { Component } from "react";

// example chat.message structure:
// [
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

const Message = props => {
  const parsePar = par => {
    return par.content.map(c => {
      switch (c.type) {
        case "text":
          return c.content;
        case "a":
          return <a href={c.href ? c.href : "/"}>{c.content}</a>;
        case "br":
          return <br />;
        default:
          return c.content;
      }
    });
  };

  const parseMessageChunk = chunk => {
    switch (chunk.type) {
      case "p":
        return <p>{parsePar(chunk)}</p>;
      default:
        return <p>foo</p>;
    }
  };

  return (
    <React.Fragment>
      {props.messageprops.chat.message.map((message, index) => {
        return (
          <div
            key={`${props.messageprops.sender}--${
              props.messageprops.timestamp
            }--${index}`}
            className={`Message ${props.messageprops.sender}`}
          >
            <div>{parseMessageChunk(message)}</div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default Message;
