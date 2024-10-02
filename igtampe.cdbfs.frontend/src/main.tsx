import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ClipboardProvider } from './components/contexts/ClipboardContext.tsx'
import DimensionsProvider from './components/contexts/DimensionsContext.tsx'
import { AuthProvider } from './components/contexts/AuthContext.tsx'
import ThemeWrapper from './ThemeWrapper.tsx'
import { RefreshProvider } from './components/contexts/RefreshContext.tsx'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClipboardProvider>
      <AuthProvider>
        <DimensionsProvider>
          <RefreshProvider>
            <ThemeWrapper>
              <SnackbarProvider maxSnack={4} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} >
                <App />
              </SnackbarProvider>
            </ThemeWrapper>
          </RefreshProvider>
        </DimensionsProvider>
      </AuthProvider>
    </ClipboardProvider>
  </StrictMode>,
)
