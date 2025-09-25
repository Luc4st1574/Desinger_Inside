/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { useForm, FormProvider } from "react-hook-form";
import { X, MailOpen, ChevronDown, Check, ThumbsUp, Search, Globe, Calendar } from 'lucide-react';
import Image from 'next/image';
import type { AnalyticsRecord, Client } from '@/types/analytics';

// --- Type Definitions ---
type AddDataFormData = Partial<Omit<AnalyticsRecord, 'recordId' | 'clientId'>>;
type AnalyticsCategory = 'social' | 'seo' | 'web' | 'email';

const categoryFields: Record<AnalyticsCategory, (keyof AddDataFormData)[]> = {
    social: ['social_fb_likes', 'social_twitter_followers', 'social_instagram_followers', 'social_linkedin_followers', 'social_tiktok_followers'],
    seo: ['seo_organic_traffic', 'seo_referring_domains', 'seo_backlinks', 'seo_organic_keywords'],
    web: ['web_sessions', 'web_new_users', 'web_avg_engagement_secs', 'web_bounce_rate'],
    email: ['email_total_contacts', 'email_open_rate', 'email_click_rate', 'email_conversion_rate']
};

interface AddDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddData: (data: AddDataFormData, clientId: string) => void;
    clients: Client[];
    initialClientId: string;
}

export default function AddDataModal({ isOpen, onClose, onAddData, clients, initialClientId }: AddDataModalProps) {
    const [activeTab, setActiveTab] = useState<AnalyticsCategory | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId);
    
    const methods = useForm<AddDataFormData>({ mode: 'onChange' });
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = methods;

    const selectedClient = clients.find(c => c.clientId === selectedClientId);
    const formValues = watch();

    const isCategoryComplete = (category: AnalyticsCategory, values: AddDataFormData): boolean => {
        return categoryFields[category].every(field => {
            const value = values[field];
            return value !== null && value !== '' && !isNaN(Number(value));
        });
    };

    const completedCategories = useMemo(() =>
        (Object.keys(categoryFields) as AnalyticsCategory[]).filter(cat => isCategoryComplete(cat, formValues)),
        [formValues]
    );

    const isAtLeastOneCategoryComplete = completedCategories.length > 0;
    const isSubmittable = isAtLeastOneCategoryComplete && !!selectedClientId && !!formValues.date && isValid;

    useEffect(() => {
        if (isOpen) {
            setActiveTab(null);
            setSelectedClientId(initialClientId);
            reset({ date: '' });
        }
    }, [isOpen, reset, initialClientId]);

    const onSubmit = (data: AddDataFormData) => {
        if (isSubmittable && selectedClientId && data.date) {
            const [month, day, year] = data.date.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            const cleanData: AddDataFormData = {};
            (Object.keys(data) as Array<keyof AddDataFormData>).forEach(key => {
                const value = data[key];
                if (value !== '') {
                    (cleanData as any)[key] = value;
                }
            });
            
            onAddData({ ...cleanData, date: formattedDate }, selectedClientId);
            onClose();
        }
    };

    const categories: { key: AnalyticsCategory; label: string; icon: React.ElementType }[] = [
        { key: 'social', label: 'Social Following', icon: ThumbsUp },
        { key: 'seo', label: 'SEO Performance', icon: Search },
        { key: 'web', label: 'Web Analytics', icon: Globe },
        { key: 'email', label: 'Email Analytics', icon: MailOpen },
    ];
    
    const { onChange: rhfDateOnChange, ...restDateRegister } = register('date', {
        required: "Date is required",
        pattern: { value: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, message: "Enter a valid date (MM/DD/YYYY)" }
    });

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        rhfDateOnChange(e);
        const input = e.target.value;
        let digits = input.replace(/\D/g, '');
        if (digits.length > 0) {
            let month = digits.slice(0, 2);
            if (parseInt(month[0], 10) > 1) { month = '0' + month[0]; }
            if (parseInt(month, 10) > 12) { month = '12'; }
            if (month === '00') { month = '01'; }
            digits = month + digits.slice(month.length);
        }
        let maskedValue = digits;
        if (digits.length >= 3) { maskedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`; }
        if (digits.length >= 5) { maskedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`; }
        setValue('date', maskedValue, { shouldValidate: true });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex min-h-full items-center justify-end px-6 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="ease-in duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                            <Dialog.Panel className="relative flex flex-col w-full max-w-lg h-[95vh] text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <div className="flex-shrink-0 px-6 pt-6 pb-4 flex justify-between items-center">
                                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 transition-colors rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none" title="Close modal" aria-label="Close add event modal"><X size={32} /></button>
                                    <Dialog.Title as="h3" className="text-xl font-light leading-6 text-gray-900 mt-4">Add Data</Dialog.Title>
                                </div>
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow min-h-0">
                                        <div className="flex-grow p-6 overflow-y-auto">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">1. Choose one or more categories</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {categories.map((cat) => (
                                                            <button key={cat.key} type="button" onClick={() => setActiveTab(cat.key)} className={`relative flex flex-col items-start p-4 border rounded-lg transition-colors text-sm font-medium outline-none ${activeTab === cat.key ? 'bg-[#f1f3ee] border-[#62864d] shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                                                                {completedCategories.includes(cat.key) && <Check className="absolute top-2 right-2 h-5 w-5 text-white bg-green-500 rounded-full p-0.5" />}
                                                                <cat.icon className="h-6 w-6 mb-1 text-[#697d67]" aria-hidden="true" />
                                                                <span className="text-black font-medium">{cat.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Listbox value={selectedClientId} onChange={setSelectedClientId}>
                                                        <Listbox.Label className="block text-sm font-medium text-gray-700">2. Select Client</Listbox.Label>
                                                        <div className="relative mt-1">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm">
                                                                {selectedClient ? (<span className="flex items-center"><Image src={selectedClient.logoUrl} alt="" width={20} height={20} className="flex-shrink-0 h-5 w-5 rounded-full" /><span className="ml-3 block truncate">{selectedClient.clientName}</span></span>) : (<span className="block truncate text-gray-400">Select from Client List</span>)}
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"><ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                                            </Listbox.Button>
                                                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                                                                    {clients.map((client) => (<Listbox.Option key={client.clientId} className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-green-100 text-green-900' : 'text-gray-900'}`} value={client.clientId}>{({ selected }) => (<><div className="flex items-center"><Image src={client.logoUrl} alt="" width={20} height={20} className="flex-shrink-0 h-5 w-5 rounded-full" /><span className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{client.clientName}</span></div>{selected && (<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600"><Check className="h-5 w-5" aria-hidden="true" /></span>)}</>)}</Listbox.Option>))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </Listbox>
                                                </div>
                                                <div className="pt-6">
                                                    {activeTab ? (
                                                        <div className="space-y-6">
                                                            <div>
                                                                <div className="flex justify-between items-baseline">
                                                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">3. Enter Date</label>
                                                                    {errors.date && <span className="text-xs text-red-600">{errors.date.message}</span>}
                                                                </div>
                                                                <div className="relative mt-1">
                                                                    <input id="date" type="text" placeholder="MM/DD/YYYY" autoComplete="off" {...restDateRegister} onChange={handleDateChange} className={`block w-full px-3 py-2 bg-gray-50 border rounded-md shadow-sm placeholder:opacity-100 focus:placeholder:opacity-0 placeholder-gray-400 focus:outline-none sm:text-sm ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
                                                                    <label htmlFor="date" className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"><Calendar className="h-5 w-5 text-black" aria-hidden="true" /></label>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                {activeTab === 'social' && categoryFields.social.map(field => (
                                                                    <div key={field}><label htmlFor={field} className="block text-sm font-medium text-gray-500 capitalize">{field.replace('social_', '').replace(/_/g, ' ')}</label><input type="text" inputMode="numeric" id={field} {...register(field)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" /></div>
                                                                ))}
                                                                {activeTab === 'seo' && categoryFields.seo.map(field => (
                                                                    <div key={field}><label htmlFor={field} className="block text-sm font-medium text-gray-500 capitalize">{field.replace('seo_', '').replace(/_/g, ' ')}</label><input type="text" inputMode="numeric" id={field} {...register(field)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" /></div>
                                                                ))}
                                                                {activeTab === 'web' && categoryFields.web.map(field => (
                                                                    <div key={field}><label htmlFor={field} className="block text-sm font-medium text-gray-500 capitalize">{field.replace('web_', '').replace(/_/g, ' ')}</label><input type="text" inputMode="numeric" id={field} {...register(field)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" /></div>
                                                                ))}
                                                                {activeTab === 'email' && categoryFields.email.map(field => (
                                                                    <div key={field}><label htmlFor={field} className="block text-sm font-medium text-gray-500 capitalize">{field.replace('email_', '').replace(/_/g, ' ')}</label><input type="text" inputMode="numeric" id={field} {...register(field)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" /></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-400 py-8"><p>Select a category to enter data.</p></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 px-6 py-4 flex justify-center gap-4">
                                            <button type="button" onClick={onClose} className="flex justify-center w-full px-10 py-3 text-sm font-medium text-[#697D67] bg-white border border-[#697D67] rounded-full hover:bg-gray-50 focus:outline-none transition-colors">Cancel</button>
                                            <button type="submit" disabled={!isSubmittable} className={`flex justify-center w-full px-12 py-3 text-sm font-medium rounded-full focus:outline-none transition-colors ${isSubmittable ? 'bg-[#697d67] hover:bg-[#556654] text-white' : 'bg-[#e2e6e4] text-gray-400 cursor-not-allowed'}`}>Submit</button>
                                        </div>
                                    </form>
                                </FormProvider>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}