"use client";
import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import MediaPicker from "./media-picker";
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [picker, setPicker] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Image,
      TableKit,
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose wysiwyg-content",
        "aria-label": "เนื้อหาบทความ",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold"),
      italic: editor?.isActive("italic"),
      heading: editor?.isActive("heading", { level: 2 }),
      list: editor?.isActive("bulletList"),
    }),
  });
  return (
    <div className="rich-editor">
      <div
        className="rich-toolbar"
        role="toolbar"
        aria-label="จัดรูปแบบเนื้อหา"
      >
        <button
          type="button"
          aria-pressed={!!state?.heading}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          หัวข้อ
        </button>
        <button
          type="button"
          aria-pressed={!!state?.bold}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <b>ตัวหนา</b>
        </button>
        <button
          type="button"
          aria-pressed={!!state?.italic}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <i>ตัวเอียง</i>
        </button>
        <button
          type="button"
          aria-pressed={!!state?.list}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • รายการ
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1. ลำดับ
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          คำพูด
        </button>
        <button
          type="button"
          onClick={() => setLink(editor?.getAttributes("link").href || "")}
        >
          ลิงก์
        </button>
        <button type="button" onClick={() => setPicker(true)}>
          แทรกรูป
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          ย้อนกลับ
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          ทำซ้ำ
        </button>
      </div>
      {link !== null && (
        <div className="link-editor">
          <label>
            ที่อยู่ลิงก์
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (
                link &&
                !/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/.test(link)
              ) {
                setError("ใช้ลิงก์ https:// หรือเส้นทางภายในเว็บ");
                return;
              }
              const chain = editor?.chain().focus().extendMarkRange("link");
              if (link) chain?.setLink({ href: link }).run();
              else chain?.unsetLink().run();
              setLink(null);
              setError("");
            }}
          >
            ใช้ลิงก์
          </button>
          <button
            type="button"
            onClick={() => {
              setLink(null);
              setError("");
            }}
          >
            ยกเลิก
          </button>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
      <EditorContent editor={editor} />
      {picker && (
        <MediaPicker
          onClose={() => setPicker(false)}
          onSelect={(url) => {
            editor?.chain().focus().setImage({ src: url, alt: "" }).run();
            setPicker(false);
          }}
        />
      )}
    </div>
  );
}
