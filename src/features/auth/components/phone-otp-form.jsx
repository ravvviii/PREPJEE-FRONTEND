'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/context/AuthContext';
import { useCountdown } from '../hooks/use-countdown';
import { isValidE164, toE164 } from '../utils/phone';

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

export function PhoneOtpForm() {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState('phone');
  const [rawPhone, setRawPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, start, isActive } = useCountdown();

  const handleSendOtp = async (event) => {
    event?.preventDefault();
    const normalized = toE164(rawPhone);
    if (!isValidE164(normalized)) {
      toast.error('Enter a valid phone number, including country code if outside India.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(normalized);
      setPhone(normalized);
      setOtp('');
      setStep('otp');
      start(RESEND_SECONDS);
      toast.success(`OTP sent to ${normalized}`);
    } catch (error) {
      toast.error(error.message || 'Could not send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event?.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      toast.error('Enter the 6-digit code sent to your phone.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(phone, otp);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Change number
        </button>

        <div className="space-y-2">
          <Label htmlFor="otp">Enter the code sent to {phone}</Label>
          <InputOTP id="otp" maxLength={OTP_LENGTH} value={otp} onChange={setOtp} autoFocus>
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || otp.length !== OTP_LENGTH}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Verify &amp; continue
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isActive || isSubmitting}
          onClick={handleSendOtp}
        >
          {isActive ? `Resend OTP in ${secondsLeft}s` : 'Resend OTP'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={rawPhone}
          onChange={(event) => setRawPhone(event.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting || !rawPhone}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send OTP
      </Button>
    </form>
  );
}
