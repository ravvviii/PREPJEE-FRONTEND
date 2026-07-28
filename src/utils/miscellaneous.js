export function trimdisplayName(name) {
  if (!name?.trim()) return 'Student';

  const firstName = name.trim().split(/\s+/)[0];

  return firstName.length > 15
    ? `${firstName.slice(0, 15)}...`
    : firstName;
}