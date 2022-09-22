import {
   HomeMajor,
   CategoriesMajor,
   SettingsMajor,
} from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";

export const NavigationBar = ({ toggler, current }) => {
   return (
      <>
         {/*Mobile UI*/}

         <div
            className={`flex sticky top-0 left-0 right-0 w-full bg-white   p-1 items-center justify-end h-[60px] rounded-lg desktop:hidden `}
         >
            <div className="text-sm flex w-full justify-center my-8 z-50 items-center">
               {current == 0 ? (
                  <h1 className=" font-[700]">Create a new Circle</h1>
               ) : (
                  <h1 className=" font-[700]">Settings</h1>
               )}
            </div>

            <button
               className={` p-3 rounded-full flex flex-col items-center `}
               onClick={() => {
                  if (current == 0) toggler(1);
                  else toggler(0);
               }}
            >
               <Icon
                  source={SettingsMajor}
                  color={`${current == 1 ? "black" : "base"}`}
               />
            </button>
         </div>

         <div className="hidden desktop:flex flex-col w-[60px] bg-white  space-y-10 p-2 items-center min-h-screen ">
            <button
               className={` p-3 rounded-full flex flex-col items-center `}
               onClick={() => {
                  toggler(0);
               }}
            >
               <Icon
                  source={HomeMajor}
                  color={`${current == 0 ? "black" : "base"}`}
               />
               <div
                  className={` ${
                     current == 0
                        ? "bg-[#008060] w-[14px] h-[4px] rounded-[6px] my-[5px]"
                        : ""
                  }`}
               ></div>
            </button>

            <button
               className={` p-3 rounded-full flex flex-col items-center `}
               onClick={() => {
                  toggler(1);
               }}
            >
               <Icon
                  source={SettingsMajor}
                  color={`${current == 1 ? "black" : "base"}`}
               />
               <div
                  className={`w-[14px] h-[4px] rounded-[6px] my-[5px] ${
                     current == 1 ? "bg-[#008060] " : ""
                  }`}
               ></div>
            </button>
         </div>
      </>
   );
};
