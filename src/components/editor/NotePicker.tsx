'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Tiptap from './TipTap'
import { toast as toaster } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { setNote } from '@/app/redux/contentSlice';
import { useToast } from '@/hooks/use-toast'

interface TodoProps {
    editItem: { content: string, _id: string } | null;
    setEditItem: Dispatch<SetStateAction<{ content: string, _id: string } | null>>;

}
const Todo: React.FC<TodoProps> = ({ editItem, setEditItem }) => {
    const [content, setContent] = useState<string>('')
    const dispatch = useDispatch();
    const noteContent = useSelector((state: RootState) => state.content.content);
    const { toast } = useToast()

    useEffect(() => {
        if (editItem) {
            setContent(editItem.content);
        }
    }, [editItem]);

    const handleContentChange = (reason: string) => {
        setContent(reason)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (editItem) {
            // Call PUT API to update content

            try {
                const res = await fetch(`/api/auth/content`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, id: editItem?._id }),
                });
                const result = await res.json();

                if (res.ok) {
                    toaster.success('Note updated successfully');
                    console.log("result put", result);
                    // Update the content in the Redux store
                    const updatedContent = noteContent.map((item: { content: string, _id: string }) =>
                        item._id === editItem._id ? { ...item, content } : item
                    );

                    dispatch(setNote(updatedContent));
                } else {
                    toast({
                        variant: "destructive",
                        title: result?.message,
                    })
                }

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "something went wrong",
                })
                console.error('Error updating note:', error);
            }
            setContent('')
            return setEditItem(null)
        }

        const cleanedContent = content.replace(/<[^>]*>/g, "").trim();
        if (!cleanedContent) {

            return toast({
                variant: "destructive",
                title: "Please enter some content",

            })
        }
        const res = await fetch("/api/auth/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });
        const result = await res.json();
        const updatedResult: { content: string; _id: string }[] = [...noteContent, result.data]

        if (res.ok) {
            toaster.success(result.message);
            dispatch(setNote(updatedResult));
            handleContentChange('')
        } else {
            return toast({
                variant: "destructive",
                title: result?.message,

            })

        }

        setEditItem(null)
        setContent('')
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
        >
            <div className="text-3xl text-center text-sky-300 mb-10">
                Notes Taker
            </div>
            <Tiptap
                content={content}
                onChange={(newContent: string) => handleContentChange(newContent)}
            />
        </form>
    )
}

export default Todo