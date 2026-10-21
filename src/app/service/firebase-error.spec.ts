import { firebaseErrorMessage } from './firebase-error';

describe('Firebase error messages', () => {
  it('explains permission, connection and sign-in configuration errors', () => {
    expect(firebaseErrorMessage({ code: 'permission-denied' }, 'save')).toContain('security rules');
    expect(firebaseErrorMessage({ code: 'unavailable' }, 'load')).toContain('connection');
    expect(firebaseErrorMessage({ code: 'auth/operation-not-allowed' }, 'save')).toContain('Anonymous');
  });

  it('does not expose raw Firebase errors to the page', () => {
    expect(firebaseErrorMessage(new Error('internal details'), 'save')).toBe('Could not save employees. Please try again.');
  });
});
