import { useState } from 'react';
import './App.scss';
import Comp1 from './Comp1';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Comp1 />
    </>
  );
}

export default App;
