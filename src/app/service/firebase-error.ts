export function firebaseErrorMessage(error: unknown, action: 'save' | 'load'): string {
  const code = (error as { code?: string })?.code;
  if (error instanceof Error && error.message.startsWith('Firebase is not configured.')) {
    return error.message;
  }
  if (code === 'permission-denied') {
    return `Could not ${action} employees. Check the Firestore security rules for this project.`;
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Enable Anonymous sign-in in the Firebase Authentication settings.';
  }
  if (code === 'unavailable' || code === 'auth/network-request-failed') {
    return 'Cannot reach Firebase. Check your connection and try again.';
  }
  return `Could not ${action} employees. Please try again.`;
}
