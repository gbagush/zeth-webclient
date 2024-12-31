"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  ListOrdered,
  List,
  Heading1,
  Heading2,
  Heading3,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react";
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Heading, Level } from "@tiptap/extension-heading";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

const Tiptap = ({
  content,
  handleContentChange,
}: {
  content: string;
  handleContentChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      UnderlineExtension,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-5",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-5",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "p-4 my-4 border rounded-md font-mono",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
  });

  const toggleBold = () => {
    if (editor) editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    if (editor) editor.chain().focus().toggleItalic().run();
  };

  const toggleStrikethrough = () => {
    if (editor) editor.chain().focus().toggleStrike().run();
  };

  const toggleUnderline = () => {
    if (editor) editor.chain().focus().toggleUnderline().run();
  };

  const toggleOrderedList = () => {
    if (editor) editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBulletList = () => {
    if (editor) editor.chain().focus().toggleBulletList().run();
  };

  const setHeading = (level: Level) => {
    if (editor) editor.chain().focus().toggleHeading({ level }).run();
  };

  const justifyText = (alignment: "left" | "center" | "right") => {
    if (editor) {
      editor.commands.setTextAlign(alignment);
    }
  };

  const toggleBlockquote = () => {
    if (editor) editor.chain().focus().toggleBlockquote().run();
  };

  return (
    <div>
      <div className="flex toolbar border rounded-md items-center">
        <Button onClick={toggleBold} variant="ghost" size="icon">
          <Bold />
        </Button>
        <Button onClick={toggleItalic} variant="ghost" size="icon">
          <Italic />
        </Button>
        <Button onClick={toggleStrikethrough} variant="ghost" size="icon">
          <Strikethrough />
        </Button>
        <Button onClick={toggleUnderline} variant="ghost" size="icon">
          <Underline />
        </Button>
        <Button onClick={toggleOrderedList} variant="ghost" size="icon">
          <ListOrdered />
        </Button>
        <Button onClick={toggleBulletList} variant="ghost" size="icon">
          <List />
        </Button>
        <Button onClick={() => setHeading(1)} variant="ghost" size="icon">
          <Heading1 />
        </Button>
        <Button onClick={() => setHeading(2)} variant="ghost" size="icon">
          <Heading2 />
        </Button>
        <Button onClick={() => setHeading(3)} variant="ghost" size="icon">
          <Heading3 />
        </Button>
        <Button onClick={() => justifyText("left")} variant="ghost" size="icon">
          <AlignLeft />
        </Button>
        <Button
          onClick={() => justifyText("center")}
          variant="ghost"
          size="icon"
        >
          <AlignCenter />
        </Button>
        <Button
          onClick={() => justifyText("right")}
          variant="ghost"
          size="icon"
        >
          <AlignRight />
        </Button>
        <Button onClick={toggleBlockquote} variant="ghost" size="icon">
          <Code />
        </Button>
      </div>
      <div className="border rounded-md p-8 mt-4">
        <EditorContent
          editor={editor}
          className="focus:outline-none border-none"
        />
      </div>
    </div>
  );
};

export default Tiptap;
