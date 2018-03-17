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

import React from "react";
import sinon from "sinon";
import { mount, shallow } from "enzyme";
import Sweetbot from "./Sweetbot.jsx";
import defaultprops from "./defaultprops.js";

const jsonOk = body => {
  const mockResponse = new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-type": "application/json"
    }
  });

  return Promise.resolve(mockResponse);
};

describe("Sweetbot", () => {
  it("mounts without exploding", () => {
    let componentDidMount = sinon.spy(Sweetbot.prototype, "componentDidMount");
    let wrapper = shallow(<Sweetbot />);

    expect(wrapper.find(".Sweetbot")).to.have.length(1);
    expect(wrapper.find(".Sweetbot").props().name).to.equal("sweetbot chatbot");
    expect(componentDidMount.calledOnce).to.equal(true);
  });

  it("has autoprops", () => {
    let wrapper = shallow(<Sweetbot auto={true} />);

    expect(wrapper.state().open).to.equal(true);
    expect(wrapper.state().messages.length).to.equal(1);
    expect(wrapper.instance().customprops).to.deep.equal(defaultprops(true));
  });

  it("has defaultprops", () => {
    let wrapper = shallow(<Sweetbot auto={false} />);

    expect(wrapper.state()).to.deep.equal({
      waiting: false,
      open: false,
      current: {
        meta: {},
        message: ""
      },
      messages: []
    });
    expect(wrapper.instance().customprops).to.deep.equal(defaultprops(false));
  });

  it("applies customprops", () => {
    let customprops = {
      styles: { accentColor: "green" }
    };
    let wrapper = shallow(<Sweetbot auto={false} customprops={customprops} />);

    expect(wrapper.instance().customprops).to.deep.equal(
      Object.assign(defaultprops(), customprops)
    );
  });

  describe("_recordChat()", () => {
    it("exists", () => {
      let wrapper = shallow(<Sweetbot auto={false} />);
      expect(wrapper.instance()._recordChat).to.be.a("function");
    });

    it("records a message", () => {
      let wrapper = shallow(<Sweetbot auto={false} />);
      let message = {
        sender: "ROBOT",
        chat: {
          message: "test",
          meta: {}
        }
      };

      expect(wrapper.state().messages.length).to.equal(0);
      wrapper.instance()._recordChat(message);
      expect(wrapper.state().messages.length).to.equal(1);
      expect(wrapper.state().messages[0].sender).to.equal("ROBOT");
      expect(wrapper.state().messages[0].chat).to.deep.equal(message.chat);
    });

    it("records a default message", () => {
      let customprops = {
        onload: {
          chat: {
            message: "default test",
            meta: {
              random: "random test"
            }
          }
        }
      };
      let wrapper = shallow(
        <Sweetbot auto={false} customprops={customprops} />
      );

      expect(wrapper.state().messages.length).to.equal(1);
      expect(wrapper.state().messages[0].sender).to.equal("SWEETBOT");
      expect(wrapper.state().messages[0].chat).to.deep.equal(
        customprops.onload.chat
      );
    });
  });

  describe("INPUT", () => {
    it("value can be changed", () => {
      let wrapper = mount(<Sweetbot auto={false} />);
      let message = "test input message";

      wrapper.find("input").simulate("change", { target: { value: message } });

      expect(wrapper.state().current.message).to.equal(message);
      expect(wrapper.find("input").props().disabled).to.be.false;
    });

    it("can be disabled", () => {
      let customprops = {
        onload: {
          chat: {
            message: "welcome message",
            meta: {
              inputDisabled: true
            }
          }
        }
      };
      let wrapper = mount(<Sweetbot auto={false} customprops={customprops} />);

      expect(wrapper.find("input").props().disabled).to.be.true;
    });

    describe("_postChat()", () => {
      beforeEach(() => {
        let stub = sinon.stub(window, "fetch"); //add stub
        stub.onCall(0).returns(jsonOk({}));
      });

      afterEach(() => {
        window.fetch.restore();
      });

      it("exists", () => {
        let wrapper = mount(<Sweetbot auto={false} />);
        expect(wrapper.instance()._postChat).to.be.a("function");
      });

      it("will not post an empty chat message", () => {
        let wrapper = mount(<Sweetbot auto={false} />);
        let postChat = wrapper.instance()._postChat;

        expect(postChat.bind(postChat, null)).to.throw(
          Error,
          "Invalid properties given in chat invocation"
        );
      });

      it("will post a new chat", () => {
        let customprops = {
          endpoint: {
            base: "https://base.com",
            path: "path"
          }
        };
        let wrapper = mount(
          <Sweetbot auto={false} customprops={customprops} />
        );
        let postChat = wrapper.instance()._postChat;

        wrapper
          .find("input")
          .simulate("change", { target: { value: "test input message" } });

        return wrapper
          .instance()
          ._postChat()
          .then(() => {
            expect(wrapper.state().messages.length).to.equal(2);
          });
      });
    });
  });
});
