import React from "react";
import useSWR from 'swr'
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/FooterAdmin.js";
import { myStxAddress } from "stacks/connect/auth";
import { useState } from "react";
import { transferDomain } from "stacks/contract/calls";
import PageChange from "components/PageChange/PageChange";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Profile() {

  const { asPath } = useRouter();

  const [newTransfer, setNewTransfer] = useState([]);

  const handleChange = (index) => (evt) => {
    newTransfer[index] = evt.target.value;
  }

  const performTransfer = (domain, index) => {
    const domainName = domain.substring(1, domain.length - 1); // removing "" from start & end
    transferDomain(domainName, newTransfer[index])
  }

  const { data, error } = useSWR(`/api/domains?principal=${myStxAddress()}`, fetcher)

  if (error) return <h1>Something went wrong!</h1>
  if (!data) return <PageChange path={asPath} />

  const myDomains = data.data;

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundColor: "Background"
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">

                <div className="text-center mt-12">
                  <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {myStxAddress()}
                  </h3>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {myDomains.length}
                    </span>
                    <span className="text-sm text-blueGray-400">
                      Domains
                    </span>
                  </div>
                </div>

                {/* Table */}


                <div className="container px-4 mx-auto">
                  <div className="flex flex-wrap">
                    <div className="w-full px-4 flex-1">
                      <span className="text-sm block my-4 p-3 font-bold text-center text-blueGray-700 rounded border-blueGray-100">MY DOMAINS</span>
                    </div>
                  </div>

                  {myDomains.map((domain, index) =>
                    <div className="flex flex-wrap">
                      <div className="w-1/2 px-4 flex-1">
                        <span className="text-sm block my-4 p-3 text-blueGray-700 rounded border-blueGray-100">{domain.value.repr}</span>
                      </div>
                      <div className="w-full px-4 flex-1">

                        <span className="text-sm block my-4 p-3 text-blueGray-700 rounded border-blueGray-100">

                          <button
                            className="float-right bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                            type="submit"
                            onClick={() => { performTransfer(domain.value.repr, index) }}
                          >
                            Transfer!
                          </button>

                          <input type="search" name="search" placeholder="New Owner" onChange={handleChange(index)}
                            className="float-right border-gray-400 bg-white h-8 w-1/2 px-5 rounded-lg text-sm focus:outline-none"></input>


                        </span>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}



