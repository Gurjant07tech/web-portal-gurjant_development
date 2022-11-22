## Overview

TRAC Monitor Web portal.

## Tech Stack

State Management - [Redux-Toolkit](https://redux-toolkit.js.org/)  
State Management - [Redux](https://github.com/reduxjs/react-redux)
Routing - [React Router](https://reactrouter.com/web/guides/quick-start) 

## Installation

Ensure [Node](https://nodejs.org/en/) and [Git](https://git-scm.com/) is setup

Clone the repository

```
git clone https://gitlab.com/trac-monitor/web-portal.git
```

Run the following command from root to install node dependencies

```
npm install
```

## Usage

On one terminal run the following code to start metro server

```
npm start
```

## File Structure

```
📦src
 ┣ 📂api <-- API files
 ┣ 📂app <-- Files for app setup (e.g. redux store)
 ┣ 📂assets <-- Asset files (e.g. image files)
 ┣ 📂components <-- Component files
 ┣ 📂containers <-- Container files (e.g. pages)
 ┣ 📂features <-- Redux slice files
 ┣ 📂lib <-- Helpful or utility library files and functions
 ┣ 📂theme <-- Theme files (e.g. fonts, metrics, root styles)
```

## Redux Usage

All redux action and reducers will be classified in a features folder as follow

```
📦src
 ┣ 📂features
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📜UserSlice.js
```

Include the newly added reducer into the rootReducer.js located in src

```
📦src
 ┣ 📜rootReducer.js
```

```
import {combineReducers} from 'redux';
import UserSlice from './features/user/UserSlice';

export default combineReducers({
  user: UserSlice.reducer, /**Add more reducers here*/
});
```

Now you can use redux hooks to access the store

```
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';    <-- import hooks
import {setName} from '../features/user/UserSlice';    <-- import actions

const UserPage = () => {
  const {name} = useSelector((state) => state.user);   <-- use hooks to select state
  const dispatch = useDispatch();

  return (
    <View>
        <Text>Count: {name}</Text>
        <Button
          onPress={() => {
            dispatch(setName('John Smith'));    <-- dispatch data to store
          }}
          title="Set Name"
        />
    </View>
  );
};

export default UserPage;

```
