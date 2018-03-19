"use strict";

module.exports = Chat => {
  Chat.message = (sessionkey, message, meta, cb) => {
    cb(null, "...", "test...", {});
  };

  Chat.remoteMethod("message", {
    accepts: [
      {
        arg: "sessionkey",
        type: "string"
      },
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
        arg: "sessionkey",
        type: "string"
      },
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
