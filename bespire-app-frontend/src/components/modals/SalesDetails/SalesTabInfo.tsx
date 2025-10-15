"use client";
import { useState, Fragment, useRef, useEffect, useCallback } from "react"; // Added useRef, useEffect, useCallback
import Image from "next/image";
import { Dialog, Listbox, Transition, TransitionChild } from "@headlessui/react";
import { Plus, X, ChevronDown } from "lucide-react";
import salesData from "@/data/salesData.json";

type Prospect = typeof salesData.prospects.list[0];

// --- Form Data and Options ---
const industries = ["B2C", "B2B", "SaaS", "E-commerce", "Healthtech", "Aerotech", "Agency", "Consulting", "Cybersecurity", "AI/ML", "Renewable Energy", "Biotech", "Supply Chain", "R&D", "Fintech", "Water Tech", "Automation", "Quantum Computing", "Neurotech", "IT Services", "Agriculture Tech"];
const companySizes = ["1-10", "11-50", "51-200", "51-200", "500+"]; // Corrected duplicate "51-200"

// Define customGreen for consistent use
const customGreen = "#697d67";
const lightGreen = "#ceffa3";

// --- Edit Photo Modal Component ---
function EditPhotoModal({ isOpen, onClose, logo, onSaveImage }: { isOpen: boolean; onClose: () => void; logo: string; onSaveImage: (newLogo: string) => void; }) {
  const [zoomValue, setZoomValue] = useState("1.1");
  const [imageScale, setImageScale] = useState(1.1); // Numeric scale for image transform
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }); // For dragging
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [initialImagePos, setInitialImagePos] = useState({ x: 0, y: 0 });
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageScale(parseFloat(zoomValue));
  }, [zoomValue]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setInitialImagePos({ x: imagePosition.x, y: imagePosition.y });
  }, [imagePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;

    setImagePosition({
      x: initialImagePos.x + dx,
      y: initialImagePos.y + dy,
    });
  }, [isDragging, startDragPos, initialImagePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSave = () => {
    // In a real application, you would generate a new cropped/zoomed image here.
    // For this example, we'll simulate saving by just calling onSaveImage with the original logo.
    // To actually implement image manipulation (cropping, scaling server-side or with canvas API),
    // you'd need a more robust solution.
    console.log("Simulating saving photo with zoom:", zoomValue, "and position:", imagePosition);
    onSaveImage(logo); // For now, just pass the original logo back
    onClose();
  };

  const zoomPercentage = ((parseFloat(zoomValue) - 1) / 1) * 100;

  return (
    <>
      <style>
        {`
          #zoom-range::-webkit-slider-thumb:active {
            background-color: ${customGreen};
          }
          #zoom-range::-moz-range-thumb:active {
            background-color: ${customGreen};
          }
        `}
      </style>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                    Edit Photo
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close edit photo modal">
                      <X size={20} />
                    </button>
                  </Dialog.Title>
                  <div className="mt-4 flex flex-col items-center gap-4">
                    <div
                      ref={imageContainerRef}
                      className="w-64 h-64 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing"
                      onMouseDown={handleMouseDown}
                    >
                       <Image
                         ref={imageRef}
                         src={logo}
                         alt="Company Logo"
                         layout="fill" // Use fill to make it responsive within the container
                         objectFit="cover"
                         className="rounded-full absolute"
                         style={{
                           transform: `scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`, // Apply zoom and pan
                           transformOrigin: 'center center',
                           cursor: isDragging ? 'grabbing' : 'grab',
                         }}
                       />
                    </div>
                    <p className="text-sm text-gray-500">Drag to reposition the photo</p>
                  </div>
                  <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                          <label htmlFor="zoom-range" className="text-lg font-medium text-gray-900">Zoom</label>
                          <div className="text-sm text-gray-500">
                             <span className="font-medium text-gray-700">{zoomValue}x</span>
                          </div>
                      </div>
                      <input
                          id="zoom-range"
                          type="range"
                          min="1"
                          max="2"
                          step="0.1"
                          value={zoomValue}
                          onChange={(e) => setZoomValue(e.target.value)}
                          className={`w-full h-8 rounded-full appearance-none cursor-pointer focus:outline-none 
                                      bg-gray-200
                                      transition-colors
                                      [&::-webkit-slider-thumb]:appearance-none 
                                      [&::-webkit-slider-thumb]:h-8 
                                      [&::-webkit-slider-thumb]:w-8
                                      [&::-webkit-slider-thumb]:rounded-full 
                                      [&::-webkit-slider-thumb]:bg-gray-400
                                      [&::-webkit-slider-thumb]:shadow-lg
                                      [&::-webkit-slider-thumb]:border-4 
                                      [&::-webkit-slider-thumb]:border-white
                                      [&::-webkit-slider-thumb]:transition-colors
                                      `}
                          style={{
                             background: `linear-gradient(to right, ${lightGreen} 0%, ${lightGreen} ${zoomPercentage}%, #e5e7eb ${zoomPercentage}%, #e5e7eb 100%)`
                          }}
                      />
                  </div>
                  <div className="mt-6 flex w-full gap-4">
                      <button type="button" onClick={onClose} className={`flex w-full justify-center px-4 py-2.5 text-sm font-medium text-[${customGreen}] bg-white border border-[${customGreen}] rounded-full hover:bg-gray-50 transition-colors`}>
                          Cancel
                      </button>
                      <button type="button" onClick={handleSave} className={`flex w-full justify-center px-4 py-2.5 text-sm font-medium text-white bg-[${customGreen}] rounded-full hover:bg-[#556654] transition-colors`}>
                          Save
                      </button>
                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// --- Main Info Tab Component ---
export default function SalesTabInfo({ prospect }: { prospect: Prospect }) {
  const [formData, setFormData] = useState({
    ...prospect,
    contactNumber: "+1234567890",
    description: "This is a placeholder description for the company. It provides general information about their operations and market position.",
    emailAddress: "someone@email.com",
    companySize: "51-200",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to handle saving the new image (e.g., updating the logo)
  const handleSaveImage = (newLogoUrl: string) => {
    setFormData(prev => ({ ...prev, logo: newLogoUrl }));
  };

  return (
    <>
      <EditPhotoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} logo={formData.logo} onSaveImage={handleSaveImage} />
      <div className="p-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <Image src={formData.logo} alt={`${formData.title} logo`} width={80} height={80} className="rounded-full object-cover border border-gray-200" />
            <button onClick={() => setIsModalOpen(true)} className="absolute -bottom-1 -right-1 bg-[#ceffa3] p-2 rounded-full border border-gray-300 shadow-sm hover:bg-opacity-90 transition-colors" aria-label="Change company logo">
              <Plus size={16} className="text-gray-800" />
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{formData.title}</h2>
        </div>
        <div className="mt-10 flex flex-col gap-6">
            <div>
              <label htmlFor="company-name" className="text-sm font-medium text-gray-500">Company Name</label>
              <input id="company-name" type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full bg-gray-100 rounded-md p-3 text-gray-900 font-medium border-0 ring-0 focus:ring-0 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="company-description" className="text-sm font-medium text-gray-500">Company Description</label>
              <textarea
                id="company-description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-100 rounded-md p-3 text-gray-900 font-medium border-0 ring-0 focus:ring-0 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="company-website" className="text-sm font-medium text-gray-500">Company Website</label>
              <input id="company-website" type="text" name="website" value={formData.website} onChange={handleInputChange} className="mt-1 block w-full bg-gray-100 rounded-md p-3 text-gray-900 font-medium border-0 ring-0 focus:ring-0 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="contact-number" className="text-sm font-medium text-gray-500">Contact Number</label>
              <input id="contact-number" type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="mt-1 block w-full bg-gray-100 rounded-md p-3 text-gray-900 font-medium border-0 ring-0 focus:ring-0 focus:outline-none" />
            </div>
             <div>
              <label htmlFor="email-address" className="text-sm font-medium text-gray-500">Email Address</label>
              <input id="email-address" type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="mt-1 block w-full bg-gray-100 rounded-md p-3 text-gray-900 font-medium border-0 ring-0 focus:ring-0 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="company-industry" className="text-sm font-medium text-gray-500">Company Industry</label>
              <Listbox value={formData.industry} onChange={(val) => setFormData(p => ({ ...p, industry: val }))}>
                <div className="relative mt-1">
                  <Listbox.Button id="company-industry" className="relative w-full cursor-default rounded-lg bg-gray-100 py-3 pl-3 pr-10 text-left font-medium border-0 ring-0 focus:ring-0 focus:outline-none">
                    <span className="block truncate">{formData.industry}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                      {industries.map((item, i) => <Listbox.Option key={i} value={item} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-100' : ''}`}>{item}</Listbox.Option>)}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div>
              <label htmlFor="company-size" className="text-sm font-medium text-gray-500">Company Size</label>
              <Listbox value={formData.companySize} onChange={(val) => setFormData(p => ({ ...p, companySize: val }))}>
                <div className="relative mt-1">
                  <Listbox.Button id="company-size" className="relative w-full cursor-default rounded-lg bg-gray-100 py-3 pl-3 pr-10 text-left font-medium border-0 ring-0 focus:ring-0 focus:outline-none">
                    <span className="block truncate">{formData.companySize}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                      {companySizes.map((item, i) => <Listbox.Option key={i} value={item} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-gray-100' : ''}`}>{item}</Listbox.Option>)}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
        </div>
      </div>
    </>
  );
}