export const spotPasswords = {
  spot1: '1',
  spot2: '2',
  spot3: '3',
  spot4: '4',
  spot5: '5',
} as const;

export type SpotKey = keyof typeof spotPasswords;

export function isValidPassword(spot: SpotKey, password: string): boolean {
  return spotPasswords[spot] === password;
} 