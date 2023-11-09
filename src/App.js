import './App.css'
import Router from './router/Router'
import {ThemeProvider, createTheme} from '@mui/material/styles';

const systemTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={systemTheme}>
      <Router />
    </ThemeProvider>

  );
}

export default App;
