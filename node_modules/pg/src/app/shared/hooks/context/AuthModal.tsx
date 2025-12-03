import { X } from 'lucide-react';
import { useState } from 'react';
import { useAuth, useAuthModal } from './AuthContext';

// Reusable Input component
const Input = ({ id, type, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={id}
        name={id}
        type={type}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  </div>
);

// Reusable Button
const Button = ({ children, ...props }) => (
  <button
    type="submit"
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    {...props}
  >
    {children}
  </button>
);

// Reusable Google Button
const GoogleButton = () => (
   <button
    type="button"
    className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Login with Google
  </button>
)

export const AuthModal = () => {
  const { isModalOpen, closeModal } = useAuthModal();
  const { login, signup } = useAuth();
  
  const [view, setView] = useState('login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest'); // Default role
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    login({ email, password, role });
  };

  const handleSignup1Submit = (e) => {
    e.preventDefault();
    setError('');
    setView('signup2');
  };

  const handleSignup2Submit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    const success = signup({ name, email, password, mobile });
    if (success) {
      setView('success');
    } else {
      setError("Sign up failed. Please try again.");
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole('guest');
    setMobile('');
    setName('');
    setConfirmPassword('');
    setError('');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="email" type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input id="password" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Login as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="guest">Guest</option>
                <option value="manager">Manager</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
            
            <Button>Login</Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <GoogleButton />

            <div className="text-center text-sm">
              <p>
                Didn't have an account?{' '}
                <button type="button" onClick={() => setView('signup1')} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        );

      case 'signup1':
        return (
          <form onSubmit={handleSignup1Submit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sign Up - Step 1/2</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="mobile" type="tel" label="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <Input id="confirmMobile" type="tel" label="Confirm Mobile Number" />
            <Button>Next</Button>
            <div className="text-center text-sm">
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setView('login')} className="font-medium text-blue-600 hover:text-blue-500">
                  Login
                </button>
              </p>
            </div>
          </form>
        );

      case 'signup2':
        return (
          <form onSubmit={handleSignup2Submit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sign Up - Step 2/2</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="name" type="text" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input id="email" type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input id="password" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input id="confirmPassword" type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button>Sign Up</Button>
            <div className="text-center text-sm">
              <button type="button" onClick={() => setView('signup1')} className="font-medium text-blue-600 hover:text-blue-500">
                &larr; Back
              </button>
            </div>
          </form>
        );

      case 'success':
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p>Account successfully created.</p>
            <Button
              onClick={() => {
                setView('login');
                resetForm();
              }}
            >
              Please Login
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    // Backdrop
    // --- THIS IS THE CHANGE ---
    // Removed "bg-black bg-opacity-50" to make the backdrop transparent
    // Added "pointer-events-none" to let you click the page behind it
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      
      {/* Modal Content */}
      {/* Added "pointer-events-auto" so you *can* click the modal itself */}
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            closeModal();
            setView('login'); // Reset view on close
            resetForm();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        {renderView()}
      </div>
    </div>
  );
};

