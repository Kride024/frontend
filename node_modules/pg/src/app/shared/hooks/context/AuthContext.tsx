// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const roleToPath = {
//   owner: "/owner/dashboard",
//   guest: "/guest/dashboard",
//   manager: "/manager/dashboard",
//   admin: "/admin/dashboard",
// };

// // --- CONTEXT FOR AUTHENTICATION ---
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Will store { name: 'Dharani', role: 'guest' }
//   const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal
//   const navigate = useNavigate();

//   // The NEW login function
//   const login = (loginData) => {
//     // loginData contains { email, password, role }
    
//     // --- SIMULATION ---
//     // In a real app, you'd send this to your API.
//     // For now, let's pretend the login is correct
//     // and create a user object based on the role.
//     const userName = loginData.email.split('@')[0]; // e.g., "dharani"
    
//     const userData = {
//       name: userName.charAt(0).toUpperCase() + userName.slice(1), // e.g., "Dharani"
//       role: loginData.role,
//     };
    
//     setUser(userData); // Set the full user object
//     setIsModalOpen(false); // Close the modal
//     navigate(roleToPath[loginData.role]); // Redirect to the correct dashboard
//   };

//   // A new (simulated) sign-up function
//   const signup = (signupData) => {
//     // signupData contains { name, email, password, mobile }
//     // --- SIMULATION ---
//     // In a real app, you'd send this to your API to create a user.
//     // We will just log it and return success.
//     console.log("New user signup:", signupData);
//     return true; // Pretend it worked
//   };

//   const logout = () => {
//     setUser(null);
//     navigate("/");
//   };

//   // Pass down the modal state and user data
//   const authValue = { user, login, logout, signup };
//   const modalValue = { isModalOpen, openModal: () => setIsModalOpen(true), closeModal: () => setIsModalOpen(false) };

//   return (
//     <AuthContext.Provider value={authValue}>
//       <AuthModalContext.Provider value={modalValue}>
//         {children}
//       </AuthModalContext.Provider>
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for Auth
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // --- SEPARATE CONTEXT FOR THE MODAL ---
// // This lets components open the modal without needing auth details
// const AuthModalContext = createContext(null);

// // Custom hook for Modal
// export const useAuthModal = () => {
//   return useContext(AuthModalContext);
// };

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PG_BASE } from "@packages/config/constants"
// 🔥 1. MOVE THIS TO TOP
const AuthModalContext = createContext(null);

const AuthContext = createContext(null);

const roleToPath = {
  owner: `${PG_BASE}/owner/dashboard`,
  guest: `${PG_BASE}/guest/dashboard`,
  manager: `${PG_BASE}/manager/dashboard`,
  admin: `${PG_BASE}/admin/dashboard`,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const login = (loginData) => {
    const userName = loginData.email.split("@")[0];

    const userData = {
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      role: loginData.role,
    };

    setUser(userData);
    setIsModalOpen(false);
    navigate(roleToPath[loginData.role]);
  };

  const signup = (signupData) => {
    console.log("New user signup:", signupData);
    return true;
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const authValue = { user, login, logout, signup };
  const modalValue = {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  };

  return (
    <AuthContext.Provider value={authValue}>
      <AuthModalContext.Provider value={modalValue}>
        {children}
      </AuthModalContext.Provider>
    </AuthContext.Provider>
  );
};

// Hooks
export const useAuth = () => useContext(AuthContext);
export const useAuthModal = () => useContext(AuthModalContext);
