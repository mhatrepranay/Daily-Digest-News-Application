import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Article = ({ article, index }) => {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const truncateContent = (content) => {
        const words = content.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        } else {
            return content;
        }
    };

    const generateMarginTopClass = (index) => {
        if (index % 2 === 0) {
            return 'md:mt-12';
        } else {
            return 'mt-4';
        }
    };

    return (
        <div
            key={article._id}
            className={`bg-white text-black rounded-lg shadow-lg overflow-hidden ${generateMarginTopClass(index)} transition-all duration-500 ease-in-out delay-${index} ${inView ? 'fade-in' : 'invisible'}`}
            ref={ref}
        >
            <div className="flex p-3">
                <div className="md:w-1/2 p-2">
                    <Link to={`/articles/${article._id}`} id="hov" className="text-[18px] font-bold mb-2">
                        {article.title}
                    </Link>
                    <p className="text-gray-400 pb-2 pt-2">Published at: {new Intl.DateTimeFormat('en-GB').format(new Date(article.createdAt))}</p>
                    <p className="text-[#272f40] text-[14px] mb-4">
                        {truncateContent(article.content)}
                        {article.content.split(' ').length > 20 && (
                            <Link className="text-blue-500 cursor-pointer ml-1" to={`/articles/${article._id}`}>
                                Read more
                            </Link>
                        )}
                    </p>
                </div>
                <div className="md:w-1/2">
                    {article.image && (
                        <Link to={`/articles/${article._id}`}>
                            <img
                                id="round"
                                src={`data:${article.image.contentType};base64,${arrayBufferToBase64(article.image.data.data)}`}
                                alt={article.title}
                                className="w-full h-auto object-cover"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Article;
