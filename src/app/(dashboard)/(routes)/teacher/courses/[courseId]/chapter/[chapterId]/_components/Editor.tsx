import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';


import React from 'react'

interface EditorProps {
    value: string,
    onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
    return (
        <div><ReactQuill theme="snow" value={value} onChange={onChange} /></div>
    )
}

export default Editor
