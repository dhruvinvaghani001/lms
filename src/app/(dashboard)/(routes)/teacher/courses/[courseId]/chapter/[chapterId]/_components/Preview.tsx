"use client";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface PreviewProps {
  value: string | null;
}

const Preview = ({ value }: PreviewProps) => {
  return (
    <>
      <ReactQuill theme="bubble" value={value || ""} readOnly />
    </>
  );
};

export default Preview;
