import React, { Component } from "react";

import "../styles/Bot.scss";

class Bot extends Component {
  state = {
    sessionid: null,
    input: "",
    messages: [],
    messagesDiv: null,
    botDiv: null,
    meta: {},
    open: false
  };

  componentDidMount = () => {
    fetch(this.props.customprops.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type: "newsession" })
    })
      .then(res => res.json())
      .then(body => {
        this.recordMessage("BOT", body.message);
        this.setState({ sessionid: body.sessionid });
      });

    let trigger = document.querySelector(".somebot-trigger");

    trigger &&
      trigger.addEventListener("click", () => {
        !this.state.open && this.setState({ open: true });
      });
  };

  close = () => {
    this.setState({ open: false });
  };

  recordMessage = (sender, message) => {
    this.setState({
      messages: this.state.messages.concat({
        SENDER: sender,
        MESSAGE: message
      })
    });
  };

  changeInput = e => {
    let input = e.target.value;
    this.state.open && this.setState({ input: input });
  };

  handleKeyPress = e => {
    this.state.open &&
      e.key === "Enter" &&
      this.state.input !== "" &&
      this.submitMessage();
  };

  scrollBottom = () => {
    let top =
      this.state.messagesDiv.scrollHeight -
      this.state.messagesDiv.parentNode.scrollHeight;
    this.state.messagesDiv.scrollTo(0, top + 120);
  };

  submitMessage = () => {
    let message = this.state.input;
    let meta = this.state.meta;
    this.setState({ input: "", meta: {} });
    this.recordMessage("USER", message);

    fetch(this.props.customprops.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionid: this.state.sessionid,
        message: message,
        meta: this.state.meta,
        type: "message"
      })
    })
      .then(res => res.json())
      .then(body => {
        this.recordMessage("BOT", body.message);
        this.scrollBottom();
        if (body.meta) {
          this.setState({ meta: body.meta });
        }
      });
  };

  render() {
    const styles = this.props.customprops.styles;
    const headerStyles = {};
    const approvedStyles = ["color", "background"];

    for (let style in styles) {
      approvedStyles.indexOf(style) > -1
        ? (headerStyles[style] = styles[style])
        : null;
    }

    const header = (
      <div className="header" style={headerStyles} onClick={this.close}>
        {this.props.customprops.name}
        <div className="close">×</div>
      </div>
    );

    const messages = (
      <div
        className="messages"
        ref={div => {
          !this.state.messagesDiv && this.setState({ messagesDiv: div });
        }}
      >
        <div className="messages-inner">
          {this.state.messages.map((message, index) => {
            return (
              <div
                key={message.SENDER + index}
                className={`message ${message.SENDER}`}
              >
                {message.MESSAGE}
              </div>
            );
          })}
        </div>
      </div>
    );

    const input = (
      <div className="input-container">
        <input
          value={this.state.input}
          onChange={this.changeInput}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );

    let botStyles = this.state.open ? { opacity: 1 } : { opacity: 0 };

    if (this.state.botDiv) {
      botStyles.right = this.state.open ? "20px" : "-540px";
    }

    return (
      <div
        className="Bot"
        style={botStyles}
        ref={div => {
          !this.state.botDiv && this.setState({ botDiv: div });
        }}
      >
        {header}
        {messages}
        {input}
      </div>
    );
  }
}

export default Bot;
