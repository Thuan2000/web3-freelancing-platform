import { createContext, useContext, useEffect, useState } from 'react';
import { useContract } from './Contract.context';
import PropTypes from 'prop-types';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { signer, getUsername } = useContract();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  const checkLoginStatus = async () => {
    if (signer) {
      const name = await getUsername(signer.address);
      if (name) {
        setIsLoggedIn(true);
        setUserName(name);
      } else {
        setIsLoggedIn(false);
        setUserName(null);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [signer]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, checkLoginStatus, userAddress: (signer && signer.address) ? signer.address : '' }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};