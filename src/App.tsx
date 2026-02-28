import './index.css';
import { componentsList } from './registry';
import DemoLayout from './layout/DemoLayout';

function App() {
  return <DemoLayout components={componentsList} />;
}

export default App;
