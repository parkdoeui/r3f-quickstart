import './App.css';
import { Canvas } from '@react-three/fiber';
import Box from './components/Box';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>
    <Canvas>
      <directionalLight intensity={0.5} />
      <ambientLight intensity={0.5} />
       <Box/>
    </Canvas>
  </div>
  );
}

export default App;
