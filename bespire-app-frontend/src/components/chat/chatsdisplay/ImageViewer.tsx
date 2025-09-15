"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Attachment } from './types';
import { ChevronLeft, ChevronRight, X, Download, Share2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface ImageViewerProps {
    images: Attachment[];
    currentIndex: number;
    onClose: () => void;
}

export default function ImageViewer({ images, currentIndex, onClose }: ImageViewerProps) {
    const [index, setIndex] = useState(currentIndex);

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isFirst = index === 0;
        setIndex(isFirst ? images.length - 1 : index - 1);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isLast = index === images.length - 1;
        setIndex(isLast ? 0 : index + 1);
    };

    const handleThumbnailClick = (thumbIndex: number) => {
        setIndex(thumbIndex);
    };

    if (!images || images.length === 0) {
        return null;
    }

    const currentImage = images[index];

    const getThumbnails = () => {
        const numImages = images.length;
        if (numImages <= 4) {
            return images;
        }

        const thumbnails = [];
        thumbnails.push(images[(index - 1 + numImages) % numImages]);
        thumbnails.push(images[index]);
        thumbnails.push(images[(index + 1) % numImages]);
        thumbnails.push(images[(index + 2) % numImages]);

        return thumbnails;
    };

    const thumbnailsToDisplay = getThumbnails();

    return (
        <div
            className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white hover:opacity-75 z-[51]"
                onClick={onClose}
                aria-label="Close image viewer"
            >
                <X size={48} />
            </button>
            <div
                className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                {images.length > 1 && (
                    <button
                        onClick={goToPrevious}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:opacity-75 z-[51]"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={48} />
                    </button>
                )}
                <div className="relative w-full h-full flex items-center justify-center">
                    {currentImage?.preview && (
                        <Image
                            src={currentImage.preview}
                            alt={currentImage.file.name || "Full screen view"}
                            fill
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className="object-contain"
                        />
                    )}
                </div>
                {images.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:opacity-75 z-[51]"
                        aria-label="Next image"
                    >
                        <ChevronRight size={48} />
                    </button>
                )}
            </div>

            <div 
                className="absolute bottom-4 right-4 p-4 rounded-lg" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 text-white">
                    <p className="font-semibold text-base">{currentImage?.file.name}</p>
                    
                    {currentImage?.senderName && (
                        <div className="flex items-center gap-3">
                            <div className="w-px h-8 bg-gray-400" />
                            <div>
                                <p className="text-xs text-gray-300">Uploaded by {currentImage.senderName}</p>
                                {currentImage.timestamp && (
                                    <p className="text-xs text-gray-300">on {format(new Date(currentImage.timestamp), 'MMMM d, yyyy')}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-4">
                        <button className="hover:opacity-75" title="Download image"><Download size={20} /></button>
                        <button className="hover:opacity-75" title="Share image"><Share2 size={20} /></button>
                        <button className="hover:opacity-75" title="More options"><MoreVertical size={20} /></button>
                    </div>
                </div>
            </div>

            {images.length > 1 && (
                <div className="mt-4 h-[10vh] flex justify-center items-center gap-2">
                    {thumbnailsToDisplay.map((img, thumbIndex) => (
                        <div
                            key={img.id}
                            className={`relative h-full aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                                images[index].id === img.id ? 'border-2 border-white' : 'opacity-60 hover:opacity-100'
                            }`}
                            onClick={() => handleThumbnailClick(images.findIndex(i => i.id === img.id))}
                        >
                            <Image
                                src={img.preview!}
                                alt={`Thumbnail ${thumbIndex + 1}`}
                                fill
                                sizes="10vw"
                                className={`object-cover ${images[index].id !== img.id ? 'grayscale' : ''}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};