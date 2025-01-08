"use client";

import { setNote } from "@/app/redux/contentSlice";
import { RootState } from "@/app/redux/store";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { toast } from "sonner";
const Notes = () => {
    // const [data, setData] = useState<{ content: string }[]>([]);
    const dispatch = useDispatch();
    const content = useSelector((state: RootState) => state.content.content) as unknown as { content: string }[] || [];

    console.log("noteContent mount", content);
    const colors = ["#ffcccc", "#ccffcc", "#ccccff", "#ffffcc", "#ffccff"];

    const fetchContent = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/content');
            console.log("response: ", { response });
            const result = await response.json();
            if (response.ok) {

                console.log("result: ", { result });
                // setData([...result.data]);
                dispatch(setNote(result.data));

            } else {
                console.error('Error fetching content:', response.statusText);
                toast.error(result?.message)
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }, []);


    useEffect(() => {
        fetchContent();
    }, []);


    return (
        <div className="max-w-6xl mx-auto px-5">
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 750: 2, 1024: 3 }}>
                <Masonry gutter="20px">
                    {content?.map((item: { content: string }, idx: number) => (
                        <div key={idx} style={{ color: colors[idx % colors.length] }}>
                            <div
                                className="px-4 py-3 font-bold text-slate-950"
                                style={{ backgroundColor: colors[idx % colors.length] }}
                            >
                                Note - {idx + 1}
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