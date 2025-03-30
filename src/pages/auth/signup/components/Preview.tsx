import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PreviewProps {
  formData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dateOfBirth: Date;
    gender: 'male' | 'female';
    address: string;
    nationality: string;
    countryOfResidence: string;
    password: string;
    confirmPassword: string;
  };
  handlePrev: () => void;
  isLoading: boolean;
}

export default function PreviewPage({
  formData,
  handlePrev,
  isLoading
}: PreviewProps) {
  const [showPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <div className="mb-3 text-xl font-semibold text-emerald-500">
        <p>Review & Complete Your Sign-Up</p>
      </div>
      <Card className="h-96 overflow-scroll rounded-xl border border-gray-200 p-2 shadow-md">
        <CardContent className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{`${formData.firstName} ${formData.lastName}`}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{formData.username}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">
              {formData.dateOfBirth instanceof Date
                ? formData.dateOfBirth.toISOString().split('T')[0]
                : (formData.dateOfBirth as string).split('T')[0]}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{formData.gender}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{formData.address}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Nationality</p>
            <p className="font-medium">{formData.nationality}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">
              Country of Residence
            </p>
            <p className="font-medium">{formData.countryOfResidence}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-muted-foreground">Password</p>

            <div className="relative">
              <p className="font-medium">
                {showPassword ? formData.password : '••••••••'}
              </p>
              <span
                className="absolute right-3 top-2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl border-emerald-600 text-base text-emerald-600 shadow-md hover:bg-emerald-100"
          onClick={handlePrev}
        >
          Edit
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="block rounded-2xl bg-emerald-500 px-4 py-2 font-play text-base text-white hover:bg-emerald-600 focus:bg-emerald-600 active:bg-emerald-700 sm:w-1/4"
        >
          {isLoading ? (
            <span>
              Submitting<span className="animate-pulse">...</span>
            </span>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </>
  );
}
