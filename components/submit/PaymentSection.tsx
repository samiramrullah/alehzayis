"use client";

import { forwardRef, FormEvent } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe } from "../lib/stripe";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

type PaymentFormProps = {
  amount: number;
  onPaid: () => void;
};

function PaymentForm({ amount, onPaid }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (!error) onPaid();
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe}
        className="mt-[28px] inline-flex h-[52px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[28px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] disabled:opacity-50"
      >
        Confirm & Pay ${amount.toFixed(2)}
      </button>
    </form>
  );
}

type PaymentSectionProps = {
  clientSecret: string;
  amount: number;
  onPaid: () => void;
};

const PaymentSection = forwardRef<HTMLDivElement, PaymentSectionProps>(
  ({ clientSecret, amount, onPaid }, ref) => {
    return (
      <section ref={ref} className="bg-[#FBF7EF] px-6 py-[70px] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[560px]">
          <SectionHeading eyebrow="Step Six" title="Payment" description="Secure checkout, powered by Stripe." />

          <div className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px] shadow-[0_22px_45px_rgba(50,12,20,0.1)]">
            <Corners />
            <div className="border border-[#C59B27]/25 bg-white px-[32px] py-[40px] sm:px-[48px]">
              {clientSecret && (
                <Elements stripe={getStripe()} options={{ clientSecret }}>
                  <PaymentForm amount={amount} onPaid={onPaid} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;