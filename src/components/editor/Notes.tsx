/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { setNote } from "@/app/redux/contentSlice";
import { RootState } from "@/app/redux/store";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, Dispatch, SetStateAction } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { toast } from "sonner";

interface NotesProps {
    setEditItem: Dispatch<SetStateAction<{ content: string, _id: string } | null>>;
}
const Notes: React.FC<NotesProps> = ({ setEditItem }) => {
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.content.content) as unknown as { content: string, _id: string }[] || [];

    const colors = ["#ffcccc", "#ccffcc", "#ccccff", "#ffffcc", "#ffccff"];

    const fetchContent = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/content');
            console.log("response: ", { response });
            const result = await response.json();
            if (response.ok) {
                dispatch(setNote(result.data));

            } else {
                console.error('Error fetching content:', response.statusText);
                toast.error(result?.message)
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }, []);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        editorProps: {
            attributes: {
                class:
                    "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            console.log("editor content", editor.getHTML());
        },

    });

    console.log(editor, "editor");




    useEffect(() => {
        fetchContent();
    }, []);


    return (
        <div className="max-w-6xl mx-auto px-5">
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 750: 2, 1024: 3 }}>
                <Masonry gutter="20px">
                    {content?.map((item: { content: string, _id: string }, idx: number) => (
                        <div key={idx} style={{ color: colors[idx % colors.length] }}>
                            <div className="flex flex-row justify-between  items-center"
                                style={{ backgroundColor: colors[idx % colors.length] }}>
                                <div
                                    className="px-4 py-3 font-bold text-slate-950"

                                >
                                    Note - {idx + 1}
                                </div>
                                <FaEdit
                                    className="text-black mr-1 cursor-pointer"
                                    onClick={() => {
                                        setEditItem(item)
                                        console.log("edit item", item);
                                        editor?.commands.setContent(item?.content);
                                    }}
                                />
                            </div>
                            <div
                                className="ProseMirror whitespace-pre-line border border-slate-700 px-6 py-4 rounded-lg"
                                style={{ whiteSpace: "pre-line" }}
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};

export default Notes;