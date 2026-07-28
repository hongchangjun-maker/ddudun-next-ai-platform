import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product shell keeps company details out of source defaults", async () => {
  const [platform, settings] = await Promise.all([
    readFile(new URL("../app/platform.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/company.ts", import.meta.url), "utf8"),
  ]);
  assert.match(platform, /뚜둔 NEXT/);
  assert.match(platform, /복잡한 선택 앞에서/);
  assert.match(platform, /AI 모델 연결 전/);
  assert.match(platform, /company &&/);
  assert.match(settings, /name: ""/);
  assert.doesNotMatch(`${platform}\n${settings}`, /193-04-03739|박성현|010-6626-7654|aplaok@naver\.com/);
});
