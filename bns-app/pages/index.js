/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/FooterAdmin.js";
import { batchRegisterDomain, checkAvailability, registerDomain } from "stacks/contract/calls";
import { useState, useEffect } from "react";

export default function Index() {

  const [domainName, setDomainName] = useState("");
  const [available, setAvailable] = useState(false);
  const [filestate, setfilestate] = useState({

    // Initially, no file is selected
    selectedFile: null
  });

  const [multipleDomains, setMultipleDomains] = useState([]);
  const [domainNames, setDomainNames] = useState([]);

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
    else {
      setAvailable(false);
    }

  }, [domainName])

  const register = async () => {

    if (domainName !== "" && available) {
      registerDomain(domainName);
    }
  }

  const batchRegister = async () => {

    if (multipleDomains.length > 0) {
      const availableDomains = multipleDomains.filter(domain => domain.availability === "Yes");

      if (availableDomains.length > 0) {
        if (availableDomains.length < 10) {
          batchRegisterDomain(availableDomains);
        }
        else {
          alert("You can only mint upto 10 domains at once!");
        }
      }
      else{
        alert("No domains are available from the list!");
      }
    }
  }

  const onFileChange = (event) => {

    setfilestate({ selectedFile: event.target.files[0] });

  };

  const onFileUpload = async () => {

    if (domainFileValidation(filestate.selectedFile)) {

      let file = new FileReader();

      file.onload = async function () {

        let names = file.result.split('\n');

        names.pop();

        for (let i = 0; i < names.length; i++) {
          names[i] = names[i].slice(0, names[i].length - 1);
        }

        setDomainNames(names);

      };

      file.readAsBinaryString(filestate.selectedFile);
    }
    else {
      alert('Invalid file type');
    }
  };

  useEffect(async () => {
    if (domainNames.length > 0) {

      let batchInfo = [];

      for (let i = 0; i < domainNames.length; i++) {
        const availability = await checkAvailability(domainNames[i]);

        if (typeof (availability) === "boolean") {
          if (availability) {
            batchInfo.push({ name: domainNames[i], availability: "Yes" })
          }
          else {
            batchInfo.push({ name: domainNames[i], availability: "No" })
          }
        }
      }

      setMultipleDomains(batchInfo);

    }
  }, [domainNames])

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

              <div className="h5 mt-4">
                <i className="ni business_briefcase-24 mr-2" />

                <input type="file" onChange={onFileChange} />
                <br></br> <br></br>

                <button
                  className="bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                  type="submit"
                  onClick={onFileUpload}
                >
                  Upload
                </button>

                {multipleDomains.length > 0 &&

                  <div className="container mt-3">
                    <div className="flex flex-wrap">
                      <div className="w-full flex-1">
                        <span className="float-left text-lg block my-4 p-3 font-bold text-center text-blueGray-700 rounded border-blueGray-100">DOMAIN NAMES</span>
                      </div>
                      <div className="w-full flex-1">
                        <span className="float-left text-lg block my-4 p-3 font-bold text-center text-blueGray-700 rounded border-blueGray-100">AVAILABILITY</span>
                      </div>
                    </div>
                    {multipleDomains.map((domain, index) =>
                      <div className="flex flex-wrap">
                        <div className="w-full flex-1">
                          <span className="float-left block text-base my-4 p-3 text-center text-blueGray-700 rounded border-blueGray-100">{domain.name}</span>
                        </div>
                        <div className="w-full flex-1">
                          <span className="float-left block text-base my-4 p-3 text-center text-blueGray-700 rounded border-blueGray-100">{domain.availability}</span>
                        </div>
                      </div>
                    )}

                    <button
                      className="bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      type="submit"
                      onClick={() => { batchRegister(); }}
                    >
                      Batch Mint!
                    </button>

                    <h> Note: Only available domains will be minted</h>

                  </div>
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

function domainFileValidation(file) {

  if (file) {
    // Allowing file type

    const found = file.name.search(".csv");

    if (found != -1) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    alert('No File Selected');
    return false;
  }
}