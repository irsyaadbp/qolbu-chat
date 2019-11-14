import React from 'react';
import TabRouter from '../../Routes/TabRouter';

import HeaderComponent from '../../Components/Dashboard/HeaderComponent';

const DashboardScreen = props => {
  return (
    <>
      <HeaderComponent navigation={props.navigation} />
      <TabRouter />
    </>
  );
};

export default DashboardScreen;
