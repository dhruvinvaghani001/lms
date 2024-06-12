import React from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import toast from 'react-hot-toast';

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

const FielUpload = ({ onChange, endpoint }: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                toast.error(error.message);
            }}
        />
    )
}

export default FielUpload