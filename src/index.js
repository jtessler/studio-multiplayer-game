import './index.css';
import App from './App';
// TODO(jrt): Migrate to newer Material UI theme provider after migrating all
// game components.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'

const WrappedApp = () => (
  <BrowserRouter>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>
);

ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
