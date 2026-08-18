import React, { useState } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { membershipService } from '../../services/membershipService';
import { MembershipPlan } from '../../types';
import { KolamMotif } from '../common/KolamMotif';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Crown,
  Sparkles,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ArrowRight,
  Download,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpgradePlanModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    selectedPlanForUpgrade: plan
  } = useMatrimony();

  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<any | null>(null);

  if (!isUpgradeModalOpen || !plan) return null;

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const paymentMethodName =
        paymentMethod === 'upi'
          ? `UPI (${upiApp.toUpperCase()})`
          : paymentMethod === 'card'
          ? 'Debit / Credit Card (Simulated)'
          : 'Net Banking (SBI / HDFC)';

      const { transaction, updatedUser } = membershipService.processUpgrade(
        currentUser,
        plan,
        paymentMethodName
      );

      updateCurrentUser(updatedUser);
      setCompletedTxn(transaction);
      setIsProcessing(false);

      showToast(`Congratulations! You are now on the ${plan.name} plan!`, 'success');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#7A1C2E', '#F3E5AB']
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  const handleClose = () => {
    setCompletedTxn(null);
    setIsProcessing(false);
    closeUpgradeModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        id="upgrade-plan-modal-container"
        className="relative w-full max-w-xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 flex items-center justify-center border border-amber-400/40 shadow-xs">
              <KolamMotif size={24} color="#F3E5AB" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-brand tracking-wide text-amber-200">
                {completedTxn ? 'Membership Activated' : 'Confirm Membership Plan'}
              </h3>
              <p className="text-xs text-amber-100/80 font-tamil">
                {completedTxn ? 'கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது' : 'பாதுகாப்பான கட்டண முறை'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Close Checkout Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4 text-xs">
          {completedTxn ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
                  Payment Successful!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Your <strong>{plan.name}</strong> subscription is now active for {plan.durationMonths} months.
                </p>
              </div>

              {/* Invoice Summary Box */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{completedTxn.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Invoice Number:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{completedTxn.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Plan Amount Paid:</span>
                  <span className="font-bold text-[#7A1C2E] dark:text-amber-300 text-sm">₹ {completedTxn.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Verified Contact Views Granted:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{completedTxn.contactViewsGranted} Contacts</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500">Valid Until:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{completedTxn.expiryDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Receipt for ${completedTxn.invoiceNumber} saved to documents.`, 'info');
                  }}
                  className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>View Receipt / Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer"
                >
                  Continue to Matrimony
                </button>
              </div>
            </div>
          ) : (
            /* Checkout & Payment Confirmation Form */
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              {/* Plan Summary Card */}
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-300/60 dark:border-amber-500/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                      {plan.name}
                    </h4>
                    {plan.badge && (
                      <span className="px-2 py-0.5 bg-amber-500 text-stone-950 rounded-full text-[10px] font-bold">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Validity: <strong>{plan.durationMonths} Months</strong> • Contact Views: <strong>{plan.contactViews}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-bold font-serif-brand text-[#7A1C2E] dark:text-amber-300">
                    ₹ {plan.price.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-stone-500">GST Included</span>
                </div>
              </div>

              {/* Payment Methods Simulation */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Select Payment Method (பாதுகாப்பான கட்டண முறை):
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-sm font-bold'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-[11px]">Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-sm font-bold'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[11px]">Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#7A1C2E] text-white border-[#7A1C2E] shadow-sm font-bold'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-[11px]">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Sub-options for UPI */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block">
                    Choose UPI App / Method:
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'qr', label: 'Scan QR' }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          upiApp === app.id
                            ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security & Prototype Simulation Notice */}
              <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Prototype Simulation Mode:</strong> Secure test transaction for demonstration. No real financial credentials required.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹ {plan.price.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
