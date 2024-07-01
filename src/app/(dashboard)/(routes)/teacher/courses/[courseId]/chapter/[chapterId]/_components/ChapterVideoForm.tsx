"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { PenLine, PlusCircle, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import FileUploadForm from "./VideoUpload";
import { CloudinaryData } from "@prisma/client";

interface ChapterVideoForm {
  videoUrl: string | null;
  courseId: string;
  chapterId: string;
  cloudinrayData: CloudinaryData | null;
}
const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "image is required!",
  }),
});

const ChapterVideoForm = ({
  videoUrl,
  courseId,
  chapterId,
  cloudinrayData,
}: ChapterVideoForm) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: videoUrl || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async ({
    secure_url,
    playback_url,
    public_id,
    asset_id,
  }: any) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapter/${chapterId}`,
        {
          videoUrl: secure_url,
          playbackId: playback_url,
          publicId: public_id,
          assetId: asset_id,
        }
      );
      toast.success(response.data.message);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Chapter Video
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && !videoUrl && (
                <>
                  <PlusCircle />
                  Add A Video
                </>
              )}
              {!isEditing && videoUrl && (
                <>
                  <PenLine />
                  Edit Video
                </>
              )}
            </Button>
          </div>
          <div className="form mt-4">
            {!isEditing && !videoUrl && (
              <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <Video className="h-10 w-10 text-slate-500" />
              </div>
            )}
            {!isEditing && videoUrl && (
              <>
                <CldVideoPlayer
                  width="1920"
                  height="1080"
                  src={cloudinrayData?.publicId!}
                />
              </>
            )}
            {isEditing && (
              <FileUploadForm
                onChange={({
                  secure_url,
                  playback_url,
                  public_id,
                  asset_id,
                }) => {
                  onSubmit({ secure_url, playback_url, public_id, asset_id });
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChapterVideoForm;
