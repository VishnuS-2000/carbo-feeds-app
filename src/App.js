import { Home } from "./components/Home";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import "@shopify/polaris/build/esm/styles.css";

import Index from "./components/HomePage";

function App() {
  console.log(process.env.REACT_APP_SHOPIFY_API_KEY);
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
          host: new URL(window.location.href).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <Index />
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default App;
