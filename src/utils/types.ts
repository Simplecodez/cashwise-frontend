export type PhoneDetails = {
  phoneNumber: string;
  countryCode: string;
  inviteCode: string;
  terms: boolean;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  nationality: string;
  countryOfResidence: string;
  password: string;
  confirmPassword: string;
};

export type SignupState = {
  currentStep: number;
  signupData: SignupData;
};
