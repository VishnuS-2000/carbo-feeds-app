import { LinkMinor } from "@shopify/polaris-icons";
import { Icon, Modal, ColorPicker, Spinner } from "@shopify/polaris";

import { DeleteMajor } from "@shopify/polaris-icons";
import { EditMajor } from "@shopify/polaris-icons";
import { MobileVerticalDotsMajor } from "@shopify/polaris-icons";

import { useState, useRef, useEffect } from "react";
import { solidColors } from "../assets/theme";

import { useAppBridge } from "@shopify/app-bridge-react";
import useAuthenticatedFetch from "../hooks/useAuthenticatedFetch";

import useSwr from "swr";

export const FeedDisplay = () => {
   const [active, setActive] = useState();
   const handleClose = () => {
      setActive(false);
   };
   const handleOpen = () => {
      setActive(true);
   };
   const [color, setColor] = useState({});

   const editRef = useRef();

   const app = useAppBridge();
   const fetchFunction = useAuthenticatedFetch(app);

   const fetcher = async (url) => {
      const response = await fetchFunction(url);
      const data = await response.json();

      return data;
   };

   const { data, isValidating, error, mutate } = useSwr(
      `${process.env.REACT_APP_HOST}/api/feeds`,
      fetcher
   );

   return (
      <>
         {/*Mobile Modal*/}
         <div className="grid desktop:hidden grid-cols-1 gap-1 py-5 ">
            {isValidating ? (
               <Spinner />
            ) : data?.result.length > 0 ? (
               data?.result?.map((e) => {
                  return (
                     <FeedRow
                        fetchFunction={fetchFunction}
                        mutate={mutate}
                        data={e}
                        editRef={editRef}
                        handleOpen={handleOpen}
                     />
                  );
               })
            ) : (
               <EmptyFeeds />
            )}

            <div className="flex desktop:hidden">
               <Modal onClose={handleClose} open={active} activator={editRef}>
                  <Modal.Section>
                     <h1 className="text-lg font-[600] font-sans">
                        Edit Circle
                     </h1>
                     <div className="flex flex-col items-start p-3 space-y-8">
                        <div className="flex space-x-3 items-center">
                           <Circle />
                           <label for="image">
                              <h1 className="text-xs font-semibold font-sans ">
                                 Upload New Photo
                              </h1>
                              <input
                                 type="file"
                                 name="image"
                                 id="image"
                                 className="hidden"
                              />
                           </label>
                        </div>
                        <div className="flex flex-col justify-between  w-full font-sans space-y-3 ">
                           <div className="flex-[1]">
                              <h1>Title</h1>
                              <input className="bg-white   w-full border  rounded-[8px] p-2 placeholder-[#6D7175] text-lg outline-none" />
                           </div>
                           <div className="flex-[1]">
                              <h1>Link</h1>
                              <select className="bg-white w-full relative   border  rounded-[8px] p-3 text-[#6D7175] text-lg outline-none ">
                                 <option className="bg-white ">Admin</option>
                                 <option className="bg-white ">Products</option>
                              </select>
                           </div>
                        </div>

                        <div className="flex flex-col ">
                           <h1 className="text-sm font-semibold font-sans">
                              Color
                           </h1>
                        </div>

                        <div className="flex flex-col space-y-5 bg-white  bg-gray-100    rounded-l-md w-full  bottom-[-60px] desktop:left-[0px] large:left-[-12px]">
                           <div className="grid gap-2 grid-cols-4 ">
                              {solidColors?.map((e, index) => {
                                 return (
                                    <button
                                       key={index}
                                       className={`w-[30px] h-[30px] rounded-full  `}
                                       style={{ background: e }}
                                       onClick={() => {
                                          setColor(e);
                                       }}
                                    ></button>
                                 );
                              })}
                           </div>
                        </div>

                        <div className="flex space-x-5 w-full ">
                           <button
                              className="   rounded-[8px] max-w-[220px] p-2 text-sm font-[600] text-white bg-gray-400"
                              onClick={handleClose}
                           >
                              Cancel
                           </button>

                           <button className="   rounded-[8px] max-w-[220px] p-2 text-sm font-[600] text-white bg-[#008060]">
                              Save Changes
                           </button>
                        </div>
                     </div>
                  </Modal.Section>
               </Modal>
            </div>
         </div>
         {/*Desktop Modal*/}
         <div className="hidden desktop:grid grid-cols-1 desktop:grid-cols-2 desktop:gap-2 desktop:p-5">
            {isValidating && !error ? (
               <Spinner />
            ) : data?.result.length > 0 ? (
               data?.result?.map((e) => {
                  return (
                     <FeedRow
                        fetchFunction={fetchFunction}
                        editRef={editRef}
                        mutate={mutate}
                        data={e}
                        handleOpen={handleOpen}
                     />
                  );
               })
            ) : (
               <EmptyFeeds />
            )}

            <div className="hidden desktop:flex">
               <Modal
                  onClose={handleClose}
                  open={active}
                  activator={editRef}
                  className="hidden desktop:flex"
               >
                  <Modal.Section>
                     <h1 className="text-xl font-[600] font-sans">
                        Edit Circle
                     </h1>
                     <div className="flex flex-col items-start p-3 space-y-8">
                        <div className="flex space-x-3 items-center">
                           <Circle />
                           <label for="image">
                              <h1 className="text-sm font-semibold font-sans ">
                                 Upload New Photo
                              </h1>
                              <input
                                 type="file"
                                 name="image"
                                 id="image"
                                 className="hidden"
                              />
                           </label>
                        </div>
                        <div className="flex justify-between  w-full font-sans ">
                           <div className="flex-[0.2]">
                              <h1>Title</h1>
                              <input className="bg-white   max-w-[480px] border  rounded-[8px] p-2 placeholder-[#6D7175] text-lg outline-none" />
                           </div>
                           <div className="flex-[0.5]">
                              <h1>Link</h1>
                              <select className="bg-white w-full  w-[200px] border  rounded-[8px] p-3 text-[#6D7175] text-lg outline-none ">
                                 <option className="bg-white ">Admin</option>
                                 <option className="bg-white ">Products</option>
                              </select>
                           </div>
                        </div>

                        <div className="flex flex-col ">
                           <h1 className="text-lg font-semibold font-sans">
                              Color
                           </h1>
                        </div>

                        <div className="flex flex-col space-y-5 justify-start bg-white  bg-gray-100    rounded-l-md w-full  bottom-[-60px] desktop:left-[0px] large:left-[-12px]">
                           <div className="grid gap-1 desktop:grid-cols-6 ">
                              {solidColors?.map((e, index) => {
                                 return (
                                    <button
                                       key={index}
                                       className={`w-[30px] h-[30px] rounded-full  `}
                                       style={{ background: e }}
                                       onClick={() => {
                                          setColor(e);
                                       }}
                                    ></button>
                                 );
                              })}
                           </div>
                        </div>

                        <div className="flex space-x-5">
                           <button
                              className="   rounded-[8px] max-w-[220px] p-2 text-sm font-[600] text-white bg-gray-400"
                              onClick={handleClose}
                           >
                              Cancel
                           </button>

                           <button className="   rounded-[8px] max-w-[220px] p-2 text-sm font-[600] text-white bg-[#008060]">
                              Save Changes
                           </button>
                        </div>
                     </div>
                  </Modal.Section>
               </Modal>
            </div>
         </div>
      </>
   );
};

export const FeedRow = ({
   data,
   editRef,
   handleOpen,
   mutate,
   fetchFunction,
}) => {
   const handleDelete = async (id) => {
      try {
         const response = await fetchFunction(
            `${process.env.REACT_APP_HOST}/api/feeds/${id}`,
            {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         // console.log(response);
         mutate();
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <>
         {/*Mobile UI*/}
         <div className="flex bg-white  p-5 rounded-[10px] desktop:hidden justify-between items-center">
            <div className="flex items-center ">
               <Circle color={`${data?.theme?.base}`} image={data?.image} />
               <div className="flex flex-col px-3 items-start space-y-1">
                  <h1 className="font-[500] text-sm  desktop:text-lg">
                     {data?.title}
                  </h1>

                  <div className="text-[#008060] flex ">
                     <Icon source={LinkMinor} color="success" />
                     <p className="text-xs  font-[600]">
                        {data?.redirects?.redirectPage}
                     </p>
                  </div>
               </div>
            </div>

            <div
               className="w-[20px] h-[20px] rounded-full  "
               style={{ background: `${data?.theme.base}` }}
            ></div>

            <div className="flex items-center space-x-2 relative">
               <button
                  className="cursor-pointer"
                  ref={editRef}
                  onClick={() => {
                     handleOpen();
                  }}
               >
                  <Icon source={EditMajor} />
               </button>
               <button
                  className="cursor-pointer"
                  onClick={() => {
                     handleDelete(data?.id);
                  }}
               >
                  <Icon source={DeleteMajor} color="critical" />
               </button>
            </div>
         </div>

         {/*Desktop UI*/}

         <div className="hidden bg-white  p-5 rounded-[10px]  desktop:flex justify-between items-center">
            <div className="flex items-center  min-w-[180px]">
               <Circle color={data?.theme.base} image={data?.image} />
               <h1 className="font-[500] text-sm ml-3 desktop:text-lg">
                  {data?.title}
               </h1>
            </div>

            <a
               href={`https://${data?.shop}/${data?.redirects?.redirectHandle}`}
            >
               <div className="text-[#008060] flex ">
                  <Icon source={LinkMinor} color="success" />
                  <p className="text-sm ml-2 font-[600]">
                     {data?.redirects?.redirectPage}
                  </p>
               </div>
            </a>

            <div
               className="w-[20px] h-[20px] rounded-full  "
               style={{ background: `${data?.theme.base}` }}
            ></div>

            <div className="flex items-center space-x-2">
               <button
                  className="cursor-pointer"
                  ref={editRef}
                  onClick={() => {
                     handleOpen();
                  }}
               >
                  <Icon source={EditMajor} />
               </button>
               <button
                  className="cursor-pointer"
                  onClick={() => {
                     handleDelete(data?.id);
                  }}
               >
                  <Icon source={DeleteMajor} color="critical" />
               </button>
            </div>
         </div>
      </>
   );
};

export const Circle = ({ color, image }) => {
   // console.log(color);
   return (
      <div
         className={`w-[50px] h-[50px] flex justify-center rounded-full border border-2  cursor-pointer desktop:justify-evenly`}
         style={{ borderColor: `${color}` }}
      >
         <img
            src={image ? image : "https://picsum.photos/seed/picsum/200/200"}
            className={`rounded-full w-full `}
         />
      </div>
   );
};

const EmptyFeeds = () => {
   return (
      <div className="flex justify-start px-1 desktop:px-0 desktop:py-5 font-bold  w-full">
         <h1 className="text-xs  desktop:text-lg">
            No Feeds Found,Add Some feeds
         </h1>
      </div>
   );
};
