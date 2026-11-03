const test = require("node:test");
const assert = require("node:assert");
const server = require("../server");

test("GET /health says the app is ok", async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/health`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(body, { status: "ok" });
});