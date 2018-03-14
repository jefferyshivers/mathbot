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
import { mount } from "enzyme";
import Sweetbot from "./Sweetbot.jsx";
import defaultprops from "./defaultprops.js";

describe("Sweetbot", () => {
  it("mounts without exploding", () => {
    let componentDidMount = sinon.spy(Sweetbot.prototype, "componentDidMount");
    let wrapper = mount(<Sweetbot />);

    expect(wrapper.find(".Sweetbot")).to.have.length(1);
    expect(componentDidMount.calledOnce).to.equal(true);
    expect(wrapper.state()).to.deep.equal({
      meta: {},
      message: "",
      messages: []
    });
    expect(wrapper.instance().customprops).to.deep.equal(defaultprops);
  });

  it("applies customprops", () => {
    let customprops = {
      styles: { accentColor: "green" }
    };
    let wrapper = mount(<Sweetbot customprops={customprops} />);

    expect(wrapper.instance().customprops).to.deep.equal(
      Object.assign(defaultprops, customprops)
    );
  });
});
