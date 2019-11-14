import React, {createContext, useMemo} from 'react';

export const UserContext = createContext();

export const UserProvider = props => {
  const [user, setUser] = React.useState(null);

  const userMemo = useMemo(() => ({user, setUser}), [user, setUser]);
  return (
    <UserContext.Provider value={userMemo}>
      {props.children}
    </UserContext.Provider>
  );
};
