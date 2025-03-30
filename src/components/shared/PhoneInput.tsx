import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { FloatingInput } from './FloatingInput';

const countryCodeSelectOptions = [
  {
    code: 'NG',
    flag: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f3-1f1ec.svg',
    name: 'Nigeria',
    dailCode: '+123-NG'
  },
  {
    code: 'GB',
    flag: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg',
    name: 'United Kingdom',
    dailCode: '+44-GB'
  },
  {
    code: 'US',
    flag: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1fa-1f1f8.svg',
    name: 'United States',
    dailCode: '+1-US'
  },
  {
    code: 'CA',
    flag: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e8-1f1e6.svg',
    name: 'Canada',
    dailCode: '+1-CA'
  }
];

interface IPhoneNumberInput {
  form: UseFormReturn<any>;
  showDropDown: boolean;
}

export default function PhoneNumberInput({
  form,
  showDropDown
}: IPhoneNumberInput) {
  const [selectedCountry, setSelectedCountry] = useState(
    countryCodeSelectOptions[0]
  );

  useEffect(() => {
    form.setValue('countryCode', selectedCountry.dailCode);
  }, [selectedCountry]);

  return (
    <div className="flex w-full flex-row gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            value={selectedCountry.dailCode}
            className="w-12 min-w-[48px] bg-slate-200 p-2 hover:bg-transparent focus:outline-none"
          >
            <img
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              className="h-6 w-6"
            />
          </Button>
        </DropdownMenuTrigger>
        {showDropDown && (
          <DropdownMenuContent align="start" className="font-play">
            {countryCodeSelectOptions.map((country) => (
              <DropdownMenuItem
                key={country.code}
                onSelect={() => setSelectedCountry(country)}
                className="flex items-center gap-2"
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className="h-6 w-6"
                />
                {country.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <FloatingInput
        form={form}
        name="phoneNumber"
        id="phoneNumber"
        label="Phone number"
        className="font-semibold"
      />
    </div>
  );
}
