import { NavigationBar } from "./NavigationBar";
import { Home } from "./Home";
import { useState } from "react";

export const DashBoard = () => {
   const handleNavigation = (id) => {
      setActive(id);
   };

   const [active, setActive] = useState(0);
   const tabs = [<Home />];

   return (
      <div className="flex flex-col font-sans space-y-5 w-full desktop:flex-row">
         {/*Responsive UI*/}
         <div className="flex-[1] desktop:flex-[0.1]">
            <NavigationBar toggler={handleNavigation} current={active} />
         </div>
         <div className="flex-[1] desktop:flex-[0.8] ">{tabs[active]}</div>
      </div>
   );
};
