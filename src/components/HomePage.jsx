import { Page, Frame } from "@shopify/polaris";
import { DashBoard } from "./Dashboard";
const Index = () => {
   return (
      <Frame>
         <Page fullWidth>
            <div className="flex flex-col justify-start items-center w-full h-screen desktop:flex desktop:flex-row  desktop:items-start">
               <DashBoard />
            </div>
         </Page>
      </Frame>
   );
};

export default Index;
