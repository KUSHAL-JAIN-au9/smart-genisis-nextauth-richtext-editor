'use client'

import React, { useState } from 'react'
import Tiptap from './TipTap'
import { toast as toaster } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { setNote } from '@/app/redux/contentSlice';
import { useToast } from '@/hooks/use-toast'

interface TodoProps {

    editItem: { content: string } | null;

}
const Todo: React.FC<TodoProps> = ({ editItem }) => {
    const [content, setContent] = useState<string>('')
    const dispatch = useDispatch();
    const noteContent = useSelector((state: RootState) => state.content.content);
    const { toast } = useToast()

    const handleContentChange = (reason: string) => {
        setContent(reason)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (editItem) {
            return toast({
                variant: "destructive",
                title: "update notes functionality not implemented yet",
            })
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
        const updatedResult: string[] = [...noteContent, result.data]
        console.log("submit data", updatedResult, cleanedContent)

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