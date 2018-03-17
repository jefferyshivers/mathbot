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
import * as API from "../utils";
import "./Sweetbot.scss";
import Message from "./Message.jsx";

export default class Sweetbot extends Component {
  constructor(props) {
    super(props);
    this._changeCurrentMessage = this._changeCurrentMessage.bind(this);
    this._inputKeyPress = this._inputKeyPress.bind(this);
    this._postChat = this._postChat.bind(this);
    this._recordChat = this._recordChat.bind(this);
  }

  state = {
    waiting: false,
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

  // TODO change this to use assign-deep?
  // FOR NOW no, require the user to reassign anything deeper than the first level of properties
  customprops = Object.assign(
    {},
    defaultprops(this.props.auto),
    this.props.customprops
  );

  componentDidMount() {
    // open the bot on load. default = false
    this.customprops.onload.open && this.setState({ open: true });

    // load default message. default = none
    this.customprops.onload.chat &&
      this._recordChat({
        sender: "SWEETBOT",
        chat: this.customprops.onload.chat
      });
  }

  _changeCurrentMessage(e) {
    this.setState({
      current: Object.assign(this.state.current, { message: e.target.value })
    });
  }

  _inputKeyPress(k) {
    this.state.open &&
      k.key === "Enter" &&
      this.state.current.message !== "" &&
      this._postChat().then(() => {
        this.setState({
          current: Object.assign(this.state.current, { message: "" })
        });
      });
  }

  _postChat() {
    const { base, path } = this.customprops.endpoint;
    this._recordChat({
      sender: "HUMAN",
      chat: Object.assign({}, this.state.current)
    });
    this.setState({ waiting: true });

    let post = API.chat({
      base,
      path,
      callback: data => {
        if (data.message && data.meta) {
          this.setState({ waiting: false });
          this._recordChat({
            sender: "SWEETBOT",
            chat: data
          });
        } else {
          this.setState({ waiting: false });
          this._recordChat({
            sender: "SWEETBOT",
            chat: {
              meta: {},
              message: this.customprops.endpoint.failureResponse
            }
          });
        }
      }
    });

    return post(this.state.current);
  }

  _recordChat({ sender, chat }) {
    const timestamp = new Date().toLocaleTimeString();
    const message = { timestamp, sender, chat };

    const { message: messageBody = "", meta = {} } = chat;

    this.setState({
      messages: [...this.state.messages, message],
      current: Object.assign(this.state.current, { meta: chat.meta })
    });
  }

  render() {
    const STYLES = {};

    for (let style in this.customprops.styles) {
      STYLES[`--${style}`] = this.customprops.styles[style];
    }

    const HEADER = (
      <div onClick={() => !this.state.open && this.setState({ open: true })}>
        <div>{this.customprops.name}</div>
        <div onClick={() => this.setState({ open: false })}>-</div>
        <div>x</div>
      </div>
    );

    const MESSAGES = (
      <div>
        <div>
          {this.state.messages.map((message, index) => (
            <Message
              key={`message-${index}-${message.sender}`}
              messageprops={message}
            />
          ))}
        </div>
      </div>
    );

    const OPTIONS = <div />;
    // TODO handle selectable, multi-selectable, selected
    // this.state.current.meta.select && this.state.current.meta.select.options
    //   ? this.state.current.meta.select.options.map(option => {
    //       return option;
    //     })
    //   : null;

    // TODO if meta.inputDisabled, don't remove it from DOM, but make it not-focusable
    const INPUT = (
      <div
        name={`${this.customprops.name} chatbot input`}
        meta={this.state.current.meta}
      >
        {OPTIONS}
        <div>
          <div>
            <input
              name="text input field"
              value={this.state.current.message}
              onChange={this._changeCurrentMessage}
              onKeyPress={this._inputKeyPress}
              disabled={this.state.current.meta.inputDisabled ? true : false}
            />
          </div>
          <div>>>></div>
        </div>
      </div>
    );

    return (
      <div
        className={`Sweetbot${this.state.open ? "" : " collapsed"}`}
        style={STYLES}
        name={`${this.customprops.name} chatbot`}
        onChange={this._changeCurrentMessage}
      >
        {HEADER}
        {MESSAGES}
        {INPUT}
      </div>
    );
  }
}
