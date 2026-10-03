import { test } from "node:test";
import assert from "node:assert/strict";
import {
  contentImageUrls,
  changeContentCover,
} from "../src/lib/content-images";
import { emptyTranslation, type Content } from "../src/lib/types";
const content = {
  image: "cover",
  gallery: ["one", "two", "three"],
  th: { ...emptyTranslation(), body: '<img src="inline">' },
  en: { ...emptyTranslation(), body: "![photo](inline)" },
} as Content;
test("collects unique cover, gallery and inline images", () => {
  assert.deepEqual(contentImageUrls(content), [
    "cover",
    "one",
    "two",
    "three",
    "inline",
  ]);
});
test("swapping covers preserves all four images and gallery order", () => {
  const changed = changeContentCover(content, "two");
  assert.deepEqual(changed.gallery, ["one", "cover", "three"]);
  assert.equal(changed.image, "two");
  assert.deepEqual(
    changeContentCover({ ...content, ...changed }, "cover").gallery,
    content.gallery,
  );
});
test("same cover does not duplicate images; external cover retains old cover", () => {
  assert.deepEqual(
    changeContentCover(content, "cover").gallery,
    content.gallery,
  );
  assert.deepEqual(changeContentCover(content, "new").gallery, [
    "one",
    "two",
    "three",
    "cover",
  ]);
});
test("full gallery rejects external cover without discarding any images but permits swapping", () => {
  const full = {
    ...content,
    gallery: Array.from({ length: 30 }, (_, i) => `image-${i}`),
  };
  assert.throws(() => changeContentCover(full, "new"));
  assert.equal(changeContentCover(full, "image-0").gallery.length, 30);
  assert.equal(full.gallery[0], "image-0");
});

test("cover changes reset focal position only when selecting a different image", () => {
  const focused = { ...content, imageFocal: { x: 20, y: 80 } };
  assert.deepEqual(
    changeContentCover(focused, "cover").imageFocal,
    focused.imageFocal,
  );
  assert.equal(changeContentCover(focused, "two").imageFocal, undefined);
});
