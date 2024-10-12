import React, { useEffect, useRef } from "react";
import "trix/dist/trix.css";
import "trix";

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener("trix-initialize", () => {
        editorElement.editor.loadHTML(value || "");
      });
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("trix-initialize", () => {});
      }
    };
  }, [value]);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <input
        id="trix-editor"
        type="hidden"
        ref={editorRef}
        value={value || ""}
        onChange={handleChange}
      />
      <trix-editor
        input="trix-editor"
        style={{ height: "170px", borderRadius: "10px" }}
      ></trix-editor>
    </div>
  );
};

export default RichTextEditor;
