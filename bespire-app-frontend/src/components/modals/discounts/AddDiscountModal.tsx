"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Discount } from '@/mocks/discounts';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discount: Omit<Discount, 'id' | 'createdOn'>) => Promise<void>;
  onUpdate?: (id: string, discount: Partial<Discount>) => Promise<void>;
  discount?: Discount;
  mode: 'create' | 'edit';
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  discount,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [formData, setFormData] = useState({
    code: '',
    type: 'Percentage' as 'Percentage' | 'Fixed Amount',
    amount: '',
    assignedTo: 'All Clients',
    createdBy: {
      id: '1',
      name: 'Lilia Hart (You)',
      role: 'Admin'
    },
    appliesTo: 'All Plans',
    status: 'Active' as 'Active' | 'Inactive' | 'Draft',
    startDate: '',
    expirationDate: null as string | null,
    limitPerCustomer: 1,
    totalLimit: 10,
    usageLimit: '0/0',
    notes: ''
  });
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    if (discount && mode === 'edit') {
      setFormData({
        code: discount.code,
        type: discount.type,
        amount: discount.amount.replace('% off', '').replace('$', '').replace(' off', ''),
        assignedTo: discount.assignedTo,
        createdBy: discount.createdBy,
        appliesTo: discount.appliesTo || 'All Plans',
        status: discount.status === 'Expired' ? 'Inactive' : discount.status,
        startDate: discount.startDate || '',
        expirationDate: discount.expirationDate,
        limitPerCustomer: discount.limitPerCustomer || 1,
        totalLimit: discount.totalLimit || 10,
        usageLimit: discount.usageLimit,
        notes: (discount as Discount & { notes?: string }).notes || ''
      });
      setSelectedType(discount.type);
      setHasExpirationDate(!!discount.expirationDate);
    } else {
      // Reset form for create mode
      setFormData({
        code: '',
        type: 'Percentage',
        amount: '',
        assignedTo: 'All Clients',
        createdBy: {
          id: '1',
          name: 'Lilia Hart (You)',
          role: 'Admin'
        },
        appliesTo: 'All Plans',
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        expirationDate: null,
        limitPerCustomer: 1,
        totalLimit: 10,
        usageLimit: '0/0',
        notes: ''
      });
      setSelectedType('Percentage');
      setHasExpirationDate(false);
      setIsUnlimited(false);
    }
  }, [discount, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.amount) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const discountData = {
        ...formData,
        amount: selectedType === 'Percentage' 
          ? `${formData.amount}% off` 
          : `$${formData.amount} off`,
        type: selectedType,
        expirationDate: hasExpirationDate ? formData.expirationDate : null,
        usageLimit: isUnlimited ? 'Unlimited' : `0/${formData.totalLimit}`
      };

      if (mode === 'edit' && discount && onUpdate) {
        await onUpdate(discount.id, discountData);
        showSuccessToast('Discount updated successfully!');
      } else {
        await onSave(discountData);
        showSuccessToast('Discount created successfully!');
      }
      
      onClose();
    } catch {
      showErrorToast('Failed to save discount');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="fixed inset-0 flex justify-end py-2">
         <DialogPanel className="w-full max-w-lg mx-4 bg-white overflow-hidden rounded-2xl flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4 ">
              <div className="flex items-center gap-3">
                {mode === 'edit' && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Discount' : 'Add New Discount'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form id="discount-form" onSubmit={handleSubmit} className="">
                {/* Choose from options */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Choose from options</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedType('Percentage')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedType === 'Percentage'
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-lg">%</span>
                        </div>
                        <span className="font-medium">Percentage</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedType('Fixed Amount')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedType === 'Fixed Amount'
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-lg">$</span>
                        </div>
                        <span className="font-medium">Fixed Amount</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Enter Discount Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter Value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                        required
                      />
                      {selectedType === 'Percentage' && (
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned to
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All Clients">All Clients</option>
                      <option value="New Clients">New Clients</option>
                      <option value="Existing Clients">Existing Clients</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created by
                    </label>
                    <select
                      value={formData.createdBy.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        createdBy: { ...prev.createdBy, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Lilia Hart (You)">Lilia Hart (You)</option>
                      <option value="Liam Parker">Liam Parker</option>
                      <option value="Avery Hayes">Avery Hayes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applies to
                    </label>
                    <select
                      value={formData.appliesTo}
                      onChange={(e) => setFormData(prev => ({ ...prev, appliesTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All Plans">All Plans</option>
                      <option value="Starter Plan">Starter Plan</option>
                      <option value="Growth Plan">Growth Plan</option>
                      <option value="Premium Plan">Premium Plan</option>
                      <option value="Enterprise Plan">Enterprise Plan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' | 'Draft' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Expiration Date
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={!hasExpirationDate}
                          onChange={(e) => setHasExpirationDate(!e.target.checked)}
                          className="rounded"
                        />
                        None
                      </label>
                    </div>
                    <input
                      type="date"
                      value={formData.expirationDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      disabled={!hasExpirationDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limit Per Customer
                    </label>
                    <input
                      type="number"
                      value={formData.limitPerCustomer}
                      onChange={(e) => setFormData(prev => ({ ...prev, limitPerCustomer: parseInt(e.target.value) }))}
                      placeholder="Max uses per user"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Total Limit
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={isUnlimited}
                          onChange={(e) => setIsUnlimited(e.target.checked)}
                          className="rounded"
                        />
                        Unlimited
                      </label>
                    </div>
                    <input
                      type="number"
                      value={formData.totalLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalLimit: parseInt(e.target.value) }))}
                      placeholder="Max uses overall"
                      disabled={isUnlimited}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter Notes Here"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </form>
            </div>

       
         

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <button
                    type="submit"
                    form="discount-form"
                    disabled={loading}
                    className="flex-1 bg-[#697D67] hover:bg-[#5a6b5a] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (mode === 'edit' ? 'Save' : 'Add Discount')}
                  </button>
                </div>
              </div>
          </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddDiscountModal;
