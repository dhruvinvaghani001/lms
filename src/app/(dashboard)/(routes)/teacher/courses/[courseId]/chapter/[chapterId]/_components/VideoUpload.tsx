import { useForm } from "react-hook-form";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface FileUploadFormProps {
  onChange: ({ secure_url, playback_url, asset_id, public_id }: any) => void;
}

export default function FileUploadForm({ onChange }: FileUploadFormProps) {
  const handleSuccess = (
    results: CloudinaryUploadWidgetResults,
    widget: any
  ) => {
    if (results.info && typeof results.info !== "string") {
      const { secure_url, playback_url, public_id, asset_id } = results.info;
      onChange({ secure_url, playback_url, public_id, asset_id });
      widget.close();
    } else {
      console.error(
        "Upload result info is not in expected format",
        results.info
      );
    }
  };

  const { register, handleSubmit } = useForm();
  return (
    <form className="flex flex-col items-start w-full">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFileSize: 2000000000,
          resourceType: "video",
          maxChunkSize: 6000000,
        }}
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <button onClick={() => open()} type="button" className="w-full">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4 (MAX. 2GB)
                  </p>
                </div>
              </label>
            </div>
          </button>
        )}
      </CldUploadWidget>
      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
    </form>
  );
}
