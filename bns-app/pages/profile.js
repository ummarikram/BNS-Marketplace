import React from "react";

import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/FooterAdmin.js";
import { myStxAddress } from "stacks/connect/auth";
import { useEffect, useState } from "react";
import { fetchDomains } from "stacks/contract/calls";

import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";

export default function Profile() {

  const [myDomains, setMyDomains] = useState([]);

  useEffect(async () => {

    const domains = await fetchDomains();

    if (domains) {
      setMyDomains(domains);
    }

  }, [])

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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

                <div className="mr-4 p-3 text-center">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">DOMAIN NAME</th>
                    </tr>
                  </thead>
                  <tbody>

                    {myDomains.map(domain =>
                      <tr>
                        <td>{domain.value.repr}</td>

                      </tr>
                    )}


                  </tbody>
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
