import React from "react";
import ReactDOM from "react-dom";

import Bot from "./containers/Bot";

const somebot = document.getElementById("somebot");

ReactDOM.render(
  <Bot customprops={JSON.parse(Object.assign(somebot.dataset).props)} />,
  somebot
);
