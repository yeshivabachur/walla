import './App.css'
import Pages from "@/pages/index.jsx"
import { RideModeProvider } from "@/state/RideModeProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Toaster } from "@/components/ui/toaster"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

function App() {
  return (
    <RideModeProvider>
      <ErrorBoundary>
        <>
      <Pages />
      <ThemeSwitcher />
      <Toaster />
    </>
      </ErrorBoundary>
    </RideModeProvider>
  )
}

export default App 