import { Icon, Spinner } from "@shopify/polaris";
import {
   AddImageMajor,
   ImageMajor,
   MobileCancelMajor,
} from "@shopify/polaris-icons";

import { useState, useCallback, useEffect } from "react";

/*Default theme colors */
import { solidColors } from "../assets/theme.js";

/*useAppBridge*/

import { useAppBridge } from "@shopify/app-bridge-react";
import useAuthenticatedFetch from "../hooks/useAuthenticatedFetch";

import { Notification } from "./Notification.jsx";
import { FeedDisplay } from "./FeedDisplay";

import useSWR, { useSWRConfig } from "swr";

import moment from "moment";

const limit = 12;
export function Home() {
   const [file, setFile] = useState(null);
   const [title, setTitle] = useState("");
   const [link, setLink] = useState({});
   const [themeModal, setThemeModal] = useState();
   const [color, setColor] = useState(solidColors[0]);
   const [notification, setNotification] = useState({});
   const [submitLoading, setSubmitLoading] = useState(false);

   const app = useAppBridge();
   const fetchFunction = useAuthenticatedFetch(app);

   const fetcher = async (url) => {
      const response = await fetchFunction(url);
      const data = await response.json();

      return data;
   };

   const { data, isValidating, error } = useSWR(
      `${process.env.REACT_APP_HOST}/api/pages`,
      fetcher
   );
   const { mutate } = useSWRConfig();
   const handlePickColor = () => {
      setThemeModal(!themeModal);
   };
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
         // console.log(err);
      }
   };
   const handleFileUpload = (e) => {
      const acceptedTypes = ["image/png", "image/jpeg"];
      // console.log(e.target.files[0]);
      if (
         !e.target.files[0] ||
         !acceptedTypes.includes(e.target.files[0].type)
      ) {
         setNotification({
            status: "error",
            message: "Invalid/Missing Image",
            createdAt: moment(),
         });
      } else {
         var reader = new FileReader();

         reader.onload = function () {
            const base64String = reader.result
               .replace("data:", "")
               .replace(/^.+,/, "");

            setFile({
               name: e.target.files[0].name,
               type: e.target.files[0].type,
               base: base64String,
               size: e.target.files[0].size,
            });
         };
         reader.readAsDataURL(e.target.files[0]);
      }
   };
   const handleSubmit = async (e) => {
      try {
         e.preventDefault();

         const redirects = link?.split(",");
         const payload = {
            image: `${file ? `data:${file.type};base64,${file.base}` : null}`,
            color,
            title,
            redirectHandle: redirects[0],
            redirectPage: redirects[1],
         };
         // console.log(payload);

         setSubmitLoading(true);
         const response = await fetchFunction("/api/feeds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });
         // console.log(response);
         if (response.ok) {
            setNotification({
               status: "success",
               message: "Feed Created",
               createdAt: moment(),
            });

            setTitle("");
            setLink(null);
            setFile(null);
            setColor(solidColors[0]);

            mutate(`$process.env.REACT_APP_HOST}/api/feeds`);
         }
      } catch (err) {
         console.log(err);
         if (!err?.response) {
            setNotification({
               status: "error",
               message: "Try again later",
               createdAt: moment(),
            });
         } else if (err?.status == 400) {
            setNotification({
               status: "error",
               message: "Missing Fields",
               createdAt: moment(),
            });
         } else {
            setNotification({
               status: "error",
               message: "Internal Server Error",
               createdAt: moment(),
            });
         }
      }

      setSubmitLoading(false);
   };

   const handleTitle = (e) => {
      if (e.target.value.length <= limit) {
         setTitle(e.target.value);
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit}>
            {notification.createdAt && <Notification options={notification} />}
            {/*Mobile UI*/}

            <div className="desktop:hidden flex flex-col w-full justify-between p-2 ">
               <div className="flex justify-between w-full">
                  <div className="bg-white flex-[0.48] rounded-[8px] p-3 text-[#6D7175] text-sm ">
                     <label
                        for="image"
                        className="w-full flex justify-evenly items-center cursor-pointer "
                     >
                        {file ? (
                           <Icon source={ImageMajor} color="success" />
                        ) : (
                           <Icon source={AddImageMajor} color="success" />
                        )}

                        <input
                           type="file"
                           className="hidden"
                           name="image"
                           id="image"
                           onChange={handleFileUpload}
                        />

                        {file?.name ? (
                           <h1 className="font-[400] ">
                              {file?.name.length > 10
                                 ? `${file?.name.slice(0, 10)}...`
                                 : `${file.name}`}
                           </h1>
                        ) : (
                           <h1 className="font-[400]">Add Image</h1>
                        )}

                        {file?.name && (
                           <button
                              type="button"
                              className="rounded-full text-xs w-[25px] p-1 h-[25px] font-bold hover:bg-slate-200 text-red-800 drop-shadow"
                              onClick={() => {
                                 setFile(null);
                              }}
                           >
                              <Icon
                                 source={MobileCancelMajor}
                                 color="critical"
                              />
                           </button>
                        )}
                     </label>
                  </div>

                  <div className="bg-white flex-[0.48] rounded-[8px] p-3 text-[#6D7175] text-sm flex  justify-evenly">
                     <button
                        type="button"
                        className="bg-white max-w-[220px] relative flex-[0.15] cursor-pointer p-1 rounded-[8px] w-full  text-[#6D7175] space-x-3 text-sm flex items-center  justify-center  large:justify-start"
                        onClick={handlePickColor}
                     >
                        <div
                           className="w-[20px] h-[20px] rounded-full "
                           style={{ background: color }}
                        ></div>
                        <h1 className="desktop:hidden large:flex">{color}</h1>

                        {themeModal && (
                           <div className="absolute z-50 w-[200px] flex flex-col space-y-2 justify-start bg-white  bg-gray-100    rounded-l-md w-full p-3 bottom-[-100px] ">
                              <div className="grid gap-1 grid-cols-3 large:grid-cols-6">
                                 {solidColors?.map((e, index) => {
                                    return (
                                       <button
                                          type="button"
                                          key={index}
                                          className={`w-[20px] h-[20px] rounded-full`}
                                          style={{
                                             background: e,
                                          }}
                                          onClick={() => {
                                             setColor(e);
                                          }}
                                       ></button>
                                    );
                                 })}
                              </div>
                           </div>
                        )}
                     </button>
                  </div>
               </div>

               <div className="flex flex-col  space-y-5 my-3">
                  <div className="relative flex-[1]">
                     <input
                        className="bg-white w-full  rounded-[8px] p-3 placeholder-[#6D7175] text-sm outline-none"
                        value={title}
                        placeholder="Title of menu"
                        onChange={handleTitle}
                     />
                     <p className="absolute right-[5px] top-[15px]">{`${title?.length}/${limit}`}</p>
                  </div>

                  <select
                     className="bg-white flex-[1] rounded-[8px] p-3 text-[#6D7175] text-sm outline-none caret-hidden"
                     value={link}
                     onChange={(e) => {
                        setLink(e.target.value);
                     }}
                  >
                     {isValidating ? (
                        <option>Loading...</option>
                     ) : (
                        data?.map((e, index) => {
                           return (
                              <option
                                 key={index}
                                 value={`${e.handle},${e.title}`}
                              >
                                 {e.title}
                              </option>
                           );
                        })
                     )}
                  </select>

                  <button
                     type="submit"
                     className="relative flex justify-center flex-[10.9] rounded-[8px] p-2 text-sm font-[600] text-white bg-[#008060]"
                  >
                     Save
                     {submitLoading && (
                        <div className="absolute right-[5px]">
                           <Spinner size="small" />
                        </div>
                     )}
                  </button>
               </div>
            </div>

            {/*Desktop UI*/}

            <div className="hidden desktop:flex  p-2 justify-evenly bg-[#F1F3F4] items-center max-w-[1600px]">
               <div className="bg-white max-w-[220px] relative flex-[0.15] rounded-[8px] p-3 text-[#6D7175] text-lg ">
                  <label className="flex justify-evenly items-center cursor-pointer ">
                     <div>
                        {file?.base ? (
                           <Icon source={ImageMajor} color="success" />
                        ) : (
                           <Icon source={AddImageMajor} color="success" />
                        )}

                        <input
                           type="file"
                           className="hidden"
                           name="image"
                           id="image"
                           onChange={handleFileUpload}
                        />
                     </div>

                     {file?.name ? (
                        <h1 className="desktop:hidden large:flex">{`${
                           file?.name?.length > 10
                              ? `${file.name.slice(0, 10)}...`
                              : file?.name
                        }`}</h1>
                     ) : (
                        <h1 className="desktop:hidden large:flex">Add Image</h1>
                     )}

                     {file?.name && (
                        <button
                           type="button"
                           className="rounded-full text-xs w-[25px] p-1 h-[25px] font-bold hover:bg-slate-200 text-red-800 drop-shadow"
                           onClick={() => {
                              setFile(null);
                           }}
                        >
                           <Icon source={MobileCancelMajor} color="critical" />
                        </button>
                     )}
                  </label>
                  {file?.name && (
                     <p className="absolute bottom-[-25px] text-sm left-0">
                        {file?.size} bytes
                     </p>
                  )}
               </div>

               <button
                  type="button"
                  className="bg-white max-w-[220px] relative flex-[0.15] cursor-pointer p-3 rounded-[8px] w-full  text-[#6D7175] space-x-3 text-lg flex items-center  justify-center  large:justify-start"
                  onClick={handlePickColor}
               >
                  <div
                     className="w-[20px] h-[20px] rounded-full "
                     style={{ background: color }}
                  ></div>
                  <h1 className="font-sans desktop:hidden large:flex">
                     {color}
                  </h1>

                  {themeModal && (
                     <div className="absolute flex flex-col space-y-2 justify-start bg-white  bg-gray-100    rounded-l-md w-full p-3 bottom-[-60px] desktop:left-[0px] large:left-[-12px]">
                        <div className="grid gap-1 desktop:grid-cols-3 large:grid-cols-6">
                           {solidColors?.map((e, index) => {
                              return (
                                 <button
                                    type="button"
                                    key={index}
                                    className={`w-[20px] h-[20px] rounded-full  `}
                                    style={{ background: e }}
                                    onClick={() => {
                                       setColor(e);
                                    }}
                                 ></button>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </button>

               <div className="flex-[0.20] relative">
                  <input
                     className="bg-white  max-w-[480px]  rounded-[8px] p-3 placeholder-[#6D7175] text-lg outline-none"
                     placeholder="Title of menu"
                     value={title}
                     onChange={(e) => {
                        e.target.value.length <= limit &&
                           setTitle(e.target.value);
                     }}
                  />
                  <p className="absolute right-[5px] top-[16px] text-sm">
                     {title?.length}/{limit}
                  </p>
               </div>

               <div className="flex-[0.20]">
                  {isValidating ? (
                     <select className="bg-white w-full max-w-[450px]   rounded-[8px] p-4 text-[#6D7175] text-lg outline-none "></select>
                  ) : (
                     <select
                        className="bg-white w-full max-w-[450px]   rounded-[8px] p-4 text-[#6D7175] text-lg outline-none "
                        value={link}
                        onChange={(e) => {
                           setLink(e.target.value);
                        }}
                     >
                        {data?.map((e, index) => {
                           return (
                              <option
                                 key={index}
                                 value={`${e.handle},${e.title}`}
                              >
                                 {e.title}
                              </option>
                           );
                        })}
                     </select>
                  )}
               </div>

               <button
                  type="submit"
                  className="relative flex-[0.10] rounded-[8px] max-w-[220px] p-3 text-lg font-[600] text-white bg-[#008060]"
               >
                  Save
                  {submitLoading && (
                     <div className="absolute right-[5px] top-[15px]">
                        <Spinner size="small" />
                     </div>
                  )}
               </button>
            </div>
         </form>
         <div className="flex flex-col desktop:py-10 ">
            <h1 className="text-sm font-[600] ml-2 desktop:text-xl">
               Current Feeds
            </h1>
            <FeedDisplay />
         </div>
      </>
   );
}
