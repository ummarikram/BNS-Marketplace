/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/FooterAdmin.js";
import { checkAvailability, registerDomain } from "stacks/contract/calls";
import { useState, useEffect } from "react";

export default function Index() {

  const [domainName, setDomainName] = useState("");
  const [available, setAvailable] = useState(false);

  const handleChange = (evt) => {
    setDomainName(evt.target.value);
  }

  useEffect(async () => {

    if (domainName !== "") {
      const availability = await checkAvailability(domainName);

      if (typeof (availability) === "boolean") {
        setAvailable(availability)
      }
    }
    else
    {
      setAvailable(false);
    }

  }, [domainName])

  const register = async () => {

    if (domainName !== "" && available) {
      await registerDomain(domainName);
    }
  }

  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">

        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-3xl text-blueGray-600">
                BUY YOUR DOMAINS WITH US!
              </h2>

              <div className="mt-12">
                <input type="search" name="search" placeholder="Search" onChange={handleChange}
                  className="border-2 border-gray-400 bg-white h-10 w-1/2 px-5 pr-16 rounded-lg text-sm focus:outline-none"></input>

                {!available &&
                  <button
                    className="bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Check
                  </button>
                }

                {available &&
                  <button
                    className="bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="submit"
                    onClick={() => { register(); }}
                  >
                    Mint!
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}
