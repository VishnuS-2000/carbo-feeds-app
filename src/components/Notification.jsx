import { Toast } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export const Notification = ({ options }) => {
   const [active, setActive] = useState(true);

   const toggleActive = useCallback(() => {
      setActive(!active);
   }, []);

   useEffect(() => {
      setActive(true);
   }, [options.createdAt]);

   const toastMarkup = active ? (
      <Toast
         content={options.message}
         error={options.status == "error" ? true : false}
         onDismiss={toggleActive}
      />
   ) : null;

   return <>{toastMarkup}</>;
};
