// Account allowed to see the hidden Wedding and House features.
export const SPECIAL_USER_EMAIL = "youssefelsaygh@gmail.com";

export const isSpecialUserEmail = (email?: string | null): boolean =>
  email === SPECIAL_USER_EMAIL;
