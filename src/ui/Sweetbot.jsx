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
import defaultprops from "./defaultprops.js";
import "./Sweetbot.scss";
import Message from "./Message.jsx";

export default class Sweetbot extends Component {
  constructor(props) {
    super(props);

    this.__recordChat = this.__recordChat.bind(this);
  }

  state = {
    // if chat window is visible or collapsed
    open: false,
    current: {
      // a slot for custom properties. gets updated from the response of each chat
      meta: {},
      // the text of the input field, or index of a multiple choice response
      message: ""
    },
    // the record of all chat messages in current session
    messages: []
  };

  customprops = Object.assign({}, defaultprops, this.props.customprops);

  componentDidMount() {
    // open the bot on load. default = false
    this.customprops.onload.open && this.setState({ open: true });

    // load default message. default = none
    this.customprops.onload.message &&
      this.__recordChat({
        sender: "BOT",
        chat: this.customprops.onload.message
      });
  }

  __recordChat({ sender, chat }) {
    const timestamp = new Date().toLocaleTimeString();
    const message = { timestamp, sender, chat, adding: true };

    this.setState(
      {
        messages: [...this.state.messages, message]
      },
      () =>
        // we do this to animated the new message.
        // with a transition set, the message is first rendered with the new (adding) css,
        // then on the next tick that css is updated to create the animation
        process.nextTick(() => {
          this.setState({
            messages: this.state.messages.map(message =>
              Object.assign(message, { adding: false })
            )
          });
        })
    );
  }

  render() {
    const STYLES = {};

    for (let style in this.customprops.styles) {
      STYLES[`--${style}`] = this.customprops.styles[style];
    }

    const INPUT = <div name={`${this.customprops.name} chatbot input`} />;

    const MESSAGES = this.state.messages.map((message, index) => (
      <Message
        key={`message-${index}-${message.sender}`}
        messageprops={message}
      />
    ));

    return (
      <div
        className="Sweetbot"
        style={STYLES}
        name={`${this.customprops.name} chatbot`}
      >
        {INPUT}
        {MESSAGES}
      </div>
    );
  }
}
