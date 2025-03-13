'use client'

import { useEffect, useState } from "react"
import { format } from "date-fns"
import Image from "next/image";
import Link from "next/link";

interface Post {
    id_post: number;
    body_text: string;
    date: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([])

    const [open, setOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(null);

    const handleToggle = () => setOpen(!open);

    const handleSubMenuToggle = (index) => {
        setSubMenuOpen(subMenuOpen === index ? null : index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/auth/posts')
                const response = await data.json()

                if (Array.isArray(response.posts)) {
                    setPosts(response.posts);
                } else {
                    console.error("Unexpected data format:", response);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <main className="grid gap-6 p-3">
            {posts.map(post => {
                const currentDate = format(post.date, 'H:mm, dd.MM.yyyy')
                return (
                    <div key={post.id_post} className="rounded-md border-[E2E8F0] p-[8px] bg-gray-100">
                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <Image
                                            className="rounded-full w-[40px] h-[40px]"
                                            src={post.profile_photo ? post.profile_photo : "/stock.png"}
                                            alt=""
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div className="grid">
                                        <span className="text-[14px] font-semibold text-gray-700">{post.first_name} {post.last_name}</span>
                                        <span className="text-[12px]">{currentDate}</span>
                                    </div>
                                </div>
                                <div>
                                    <nav>
                                        {/* 3 point (edit, remove) */}
                                        <button className="text-green-600 font-bold py-2 px-4 rounded focus:outline-none" onClick={handleToggle} >
                                            <svg width="6" height="18" viewBox="0 0 6 18" fill="none" className="fill-gray-500" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.1875 9C5.1875 9.43265 5.05921 9.85558 4.81884 10.2153C4.57847 10.575 4.23683 10.8554 3.83712 11.021C3.43741 11.1866 2.99757 11.2299 2.57324 11.1455C2.14891 11.0611 1.75913 10.8527 1.45321 10.5468C1.14728 10.2409 0.938938 9.85109 0.854533 9.42676C0.770128 9.00243 0.813448 8.56259 0.979015 8.16288C1.14458 7.76317 1.42496 7.42153 1.78469 7.18116C2.14442 6.9408 2.56735 6.8125 3 6.8125C3.58016 6.8125 4.13656 7.04297 4.5468 7.45321C4.95703 7.86344 5.1875 8.41984 5.1875 9ZM3 4.9375C3.43265 4.9375 3.85558 4.80921 4.21531 4.56884C4.57504 4.32848 4.85542 3.98683 5.02099 3.58712C5.18655 3.18741 5.22987 2.74757 5.14547 2.32324C5.06106 1.89891 4.85273 1.50913 4.5468 1.2032C4.24087 0.897278 3.85109 0.688938 3.42676 0.604533C3.00243 0.520128 2.56259 0.563448 2.16288 0.729015C1.76317 0.894581 1.42153 1.17496 1.18116 1.53469C0.940796 1.89442 0.812501 2.31735 0.812501 2.75C0.812501 3.33016 1.04297 3.88656 1.45321 4.2968C1.86344 4.70703 2.41984 4.9375 3 4.9375ZM3 13.0625C2.56735 13.0625 2.14442 13.1908 1.78469 13.4312C1.42496 13.6715 1.14458 14.0132 0.979015 14.4129C0.813448 14.8126 0.770128 15.2524 0.854533 15.6768C0.938938 16.1011 1.14728 16.4909 1.45321 16.7968C1.75913 17.1027 2.14891 17.3111 2.57324 17.3955C2.99757 17.4799 3.43741 17.4366 3.83712 17.271C4.23683 17.1054 4.57847 16.825 4.81884 16.4653C5.05921 16.1056 5.1875 15.6826 5.1875 15.25C5.1875 14.6698 4.95703 14.1134 4.5468 13.7032C4.13656 13.293 3.58016 13.0625 3 13.0625Z" />
                                            </svg>
                                        </button>
                                        {open && (
                                            <ul>
                                                <li>
                                                    <button
                                                        className="flex justify-between w-full text-left py-2 px-4 hover:bg-gray-200"
                                                        onClick={() => handleSubMenuToggle(1)}
                                                    >
                                                        Courses
                                                        <span className={`transform transition-transform ${subMenuOpen === 1 ? "rotate-180" : ""}`}>
                                                            ▼
                                                        </span>
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </nav>
                                </div>
                            </div>
                            <div key={post.body_text} className="pt-[12]">
                                {/* text */}
                                {/* <p>
                            Habitant morbi tristique senectus et netus et. Suspendisse sed nisi lacus sed viverra. Dolor morbi non arcu risus quis varius. #amazing #great #lifetime #uiux #machinelearning
                        </p> */}
                                <p>
                                    {post.body_text}
                                </p>

                            </div>
                            <div className="pt-[16]">
                                {/* photo / video / null */}
                                {/* <img src='null' alt="Post photo" /> */}
                            </div>
                        </div>
                        <div className="pt-[12]">
                            <div className="flex gap-3 items-center">
                                {/* likes, comments, share */}
                                <Link href={'/'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 hover:fill-rose-700 hover:stroke-rose-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </Link>
                                <Link href={'/'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 hover:stroke-sky-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                                    </svg>
                                </Link>
                            </div>
                            <div>
                                {/* bookmarks */}
                            </div>
                        </div>
                    </div>
                )
            })}
        </main>
    )
}