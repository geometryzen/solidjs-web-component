import { MyFoo } from "../src/index";

test("MyFoo", function () {
    expect(typeof MyFoo === 'function').toBe(true);
});
