"use strict";

module.exports = Chat => {
  const responses = {
    "Just browsing": {
      message: "Cool, have fun!",
      meta: {
        endpoint: {
          path: "chats/message/browsing",
          failureResponse:
            "Sorry, I don't have much else to say yet - I'm still being setup!"
        }
      }
    },
    "Prospective user": {
      message: [
        "Awesome, thanks for checking this out then!",
        "Let me know if you have any questions",
        "Enjoy!",
        {
          type: "p",
          content: "here is another p..."
        },
        {
          type: "p",
          content: {
            type: "a",
            href: "https://www.test.com",
            content: "and a link!"
          }
        },
        {
          type: "p",
          content: [
            "This is a long response. It actually looks like a paragraph, but we've simply inserted a break (<br/>) to give the impression of two paragraphs.",
            { type: "br" },
            {
              type: "a",
              content: "Here's a link, too!"
            },
            { type: "br" },
            "And here's another break. Here's a ",
            { type: "a", content: "link" },
            " inside the text. Sweet"
          ]
        }
      ],
      meta: {}
    },
    "Already using sweetbot": {
      message: "Sweet - having fun?",
      meta: {}
    }
  };

  Chat.message = (message, meta, cb) => {
    const response = responses[message]
      ? responses[message]
      : { message: "Oops something went wrong", meta: {} };

    cb(null, response.message, response.meta);
  };

  Chat.remoteMethod("message", {
    accepts: [
      {
        arg: "message",
        type: "string"
      },
      {
        arg: "meta",
        type: "object"
      }
    ],
    returns: [
      {
        arg: "message",
        type: "string"
      },
      {
        arg: "meta",
        type: "object"
      }
    ]
  });
};
