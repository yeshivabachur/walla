import './App.css'
import Pages from "@/pages/index.jsx"
import { RideModeProvider } from "@/state/RideModeProvider"
import { SensoryProvider } from "@/state/SensoryProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Toaster } from "@/components/ui/toaster"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import EasterEggManifold from "@/components/ui/EasterEggManifold"

function App() {
  return (
    <RideModeProvider>
      <SensoryProvider>
        <ErrorBoundary>
          <>
            <Pages />
            <ThemeSwitcher />
            <EasterEggManifold />
            <Toaster />
          </>
        </ErrorBoundary>
      </SensoryProvider>
    </RideModeProvider>
  )
}

export default App 