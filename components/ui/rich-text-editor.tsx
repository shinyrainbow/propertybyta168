"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading editor...</span>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link"],
          ["blockquote"],
          ["clean"],
        ],
      },
    }),
    []
  );

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "blockquote",
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 150px;
          font-size: 14px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background: #ffffff;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: #f9fafb;
        }
        .rich-text-editor .ql-editor {
          min-height: 150px;
          color: #1f2937;
          background: #ffffff;
        }
        .rich-text-editor .ql-editor p,
        .rich-text-editor .ql-editor span,
        .rich-text-editor .ql-editor li {
          color: inherit;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item::before {
          content: "Normal";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
          content: "Heading 1";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
          content: "Heading 2";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
          content: "Heading 3";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: "Normal";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
          content: "Small";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
          content: "Large";
        }
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
        .rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
          content: "Huge";
        }
      `}</style>
    </div>
  );
}
