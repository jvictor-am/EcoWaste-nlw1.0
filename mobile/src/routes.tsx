import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {backgroundColor: '#f0f0f5'},
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <AppStack.Screen
          name="Home"
          component={Home}
          // options={{title: 'Eco Waste managment - Home'}}
        />
        <AppStack.Screen
          name="Points"
          component={Points}
          // options={{title: 'Eco Waste managment - Points'}}
        />
        <AppStack.Screen
          name="Detail"
          component={Detail}
          // options={{title: 'Eco Waste managment - Detail'}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
