import { collection, doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { db } from './firebaseConfig';
import SignIn from './pages/SignIn';

function App() {

  return (
    <div className="App">
      <SignIn/>
    </div>
  );
}

export default App;
