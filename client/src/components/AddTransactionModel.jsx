import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";
import { useForm } from "react-hook-form";
import apiClient from '@/lib/axios';

const expenseCategories = [
  "Food & Dining", "Groceries", "Transportation", "Shopping",
  "Bills & Utilities", "Entertainment", "Healthcare", "Education",
  "Travel", "Investments", "EMI / Loans"
];

const incomeCategories = [
  "Salary", "Freelancing", "Investments", "Bonus", "Gift", "Other"
];

const AddTransactionModel = ({ isOpen, onClose,onSuccess }) => {

  const [txnType, setTxnType] = useState('expense');
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const categories = txnType === 'expense' ? expenseCategories : incomeCategories;

  // Called when RHF validates the form and it passes
  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await apiClient.post('/transactions', {
        ...data,
        type: txnType,
        amount: Number(data.amount),
      });
      onSuccess();
      reset();
      onClose(false); // close the modal
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleTypeSwitch = (type) => {
    setTxnType(type);
    // Reset category when switching type so stale value isn't submitted
    reset((prev) => ({ ...prev, category: '' }));
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>

        <DialogContent
          className="p-0 gap-0 border-0 overflow-hidden max-w-md w-full"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.96) 100%)',
            boxShadow: '0 24px 64px rgba(14,165,233,0.16), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(14,165,233,0.10)',
            backdropFilter: 'blur(24px)',
            borderRadius: '20px',
          }}
        >

          {/* Modal Header */}
          <div
            className="px-6 pt-6 pb-5 border-b border-slate-100/80"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(99,102,241,0.03) 100%)' }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
                  boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
                }}
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="10" y1="4" x2="10" y2="16" />
                  <line x1="4" y1="10" x2="16" y2="10" />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  Add New Transaction
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Track your income or expenses</p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-5">

                {/* Type Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Transaction Type
                  </label>
                  <div
                    className="flex gap-2 p-1 rounded-xl"
                    style={{ background: 'rgba(241,245,249,0.8)', border: '1px solid rgba(226,232,240,0.6)' }}
                  >
                    <button
                      type="button"
                      onClick={() => handleTypeSwitch('expense')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={txnType === 'expense' ? {
                        background: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)',
                        color: '#fff',
                        boxShadow: '0 3px 10px rgba(244,63,94,0.30)',
                      } : { color: '#94a3b8' }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="2" y1="7" x2="12" y2="7" />
                      </svg>
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSwitch('income')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={txnType === 'income' ? {
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        color: '#fff',
                        boxShadow: '0 3px 10px rgba(16,185,129,0.30)',
                      } : { color: '#94a3b8' }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="7" y1="2" x2="7" y2="12" />
                        <line x1="2" y1="7" x2="12" y2="7" />
                      </svg>
                      Income
                    </button>
                  </div>
                </div>

                {/* Amount Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`w-full pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl border bg-white/70 outline-none transition-all duration-200 focus:ring-2 placeholder:text-slate-300 placeholder:font-normal ${
                        errors.amount
                          ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                      }`}
                      placeholder="0.00"
                      style={{ backdropFilter: 'blur(8px)' }}
                      {...register('amount', {
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Amount must be greater than 0' },
                      })}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-rose-500 font-medium mt-0.5">{errors.amount.message}</p>
                  )}
                </div>

                {/* Category Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full appearance-none border rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-white/70 outline-none transition-all duration-200 focus:ring-2 cursor-pointer ${
                        errors.category
                          ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                      }`}
                      style={{ backdropFilter: 'blur(8px)' }}
                      {...register('category', { required: 'Please select a category' })}
                    >
                      <option value="">Select a category…</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {/* Chevron */}
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                      viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="4 6 8 10 12 6" />
                    </svg>
                  </div>
                  {errors.category && (
                    <p className="text-xs text-rose-500 font-medium mt-0.5">{errors.category.message}</p>
                  )}
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Description <span className="normal-case font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-700 rounded-xl border border-slate-200 bg-white/70 outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-300"
                    placeholder="e.g. Coffee with friends"
                    style={{ backdropFilter: 'blur(8px)' }}
                    {...register('description')}
                  />
                </div>

                {/* Date Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-700 rounded-xl border border-slate-200 bg-white/70 outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 cursor-pointer"
                    style={{ backdropFilter: 'blur(8px)' }}
                    {...register('date', { required: 'Date is required' })}
                  />
                  {errors.date && (
                    <p className="text-xs text-rose-500 font-medium mt-0.5">{errors.date.message}</p>
                  )}
                </div>

                {/* Server-side error */}
                {serverError && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-100">
                    <svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="8" cy="8" r="6" />
                      <line x1="8" y1="5" x2="8" y2="8" />
                      <line x1="8" y1="11" x2="8.01" y2="11" />
                    </svg>
                    <p className="text-xs text-rose-600 font-medium">{serverError}</p>
                  </div>
                )}

              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-6">
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={() => { reset(); setServerError(null); }}
                    className="flex-1 py-2.5 text-sm font-semibold text-slate-500 rounded-xl border border-slate-200 bg-white/70 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Cancel
                  </button>
                </DialogClose>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex-1 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  style={{
                    background: txnType === 'expense'
                      ? 'linear-gradient(135deg, #F43F5E 0%, #FB923C 100%)'
                      : 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
                    boxShadow: txnType === 'expense'
                      ? '0 4px 14px rgba(244,63,94,0.35)'
                      : '0 4px 14px rgba(14,165,233,0.35)',
                    transition: 'background 0.3s, box-shadow 0.3s, transform 0.2s',
                  }}
                >
                  {/* Shimmer */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }}
                  />
                  <span className="relative z-10">
                    {isSubmitting
                      ? 'Saving…'
                      : txnType === 'expense' ? '➖ Save Expense' : '➕ Save Income'
                    }
                  </span>
                </button>
              </div>

            </form>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTransactionModel;
