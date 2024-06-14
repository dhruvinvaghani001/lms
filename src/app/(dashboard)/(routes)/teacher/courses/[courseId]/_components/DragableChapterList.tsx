"use client";
import { Badge } from "@/components/ui/badge";
import { Chapter } from "@prisma/client";
import { Reorder } from "framer-motion";
import { BookCheck, Pen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DragableChaptersProps {
    chapters: Chapter[];
    courseId: string;
}

function DragableChapterList({ chapters, courseId }: DragableChaptersProps) {

    const [items, setItems] = useState(chapters);
    return (
        <Reorder.Group axis="y" onReorder={setItems} values={items}>
            {items.map((chapter) => (
                <Reorder.Item key={chapter.id} value={chapter} className="mb-2">
                    <div className='flex bg-muted items-center p-2 px-4 rounded-lg justify-between' >
                        <div className='flex items-center gap-2'>
                            <BookCheck width={20} />
                            {chapter.title}
                        </div>
                        <div className='flex items-center gap-2'>
                            {
                                chapter.isPublished ? <Badge variant="default">Published</Badge> : <Badge variant="default">Draft</Badge>
                            }
                            <Link href={`/teacher/courses/${courseId}/chapter/${chapter.id}`}>
                                <Pen width={18} />
                            </Link>
                        </div>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}

export default DragableChapterList;
