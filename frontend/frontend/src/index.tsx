// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./App";
import Intro from "../src/intro/Intro";
import SetPerfil from "../src/setperfil/Setperfil";
import RegisterProduct from "../src/registerproduct/RegisterProduct";
import Addbatch from "../src/addbatch/Addbatch";
import ReviewProduction from "../src/reviewproduction/ReviewProduct";
import reportWebVitals from "./reportWebVitals";
import Company from "../src/company/Company";
import Land from "../src/landing/Land";
import Sign from "../src/sign/Sign";
import Costumers from "./costumers/Costumers";
import Empresa from "./empresa/Empresa";
import Productions from "./productions/Productions";

import { createRoot } from 'react-dom/client';
import SKU from "./sku/SKU";
const container = document.getElementById('root');
const root = createRoot(container!);


root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Land />} />
                <Route path="/" element={<Intro />} />
                <Route path="/home" element={<Land />} />
                <Route path="/setperfil" element={<SetPerfil />} />
                <Route path="/App" element={<App />} />
                <Route path="/registerproduct" element={<RegisterProduct/>} />
                <Route path="/review-production" element={<ReviewProduction />} />
                <Route path="/addbatch/:id" element={<Addbatch />} />
                <Route path="/company" element={<Company />} />
                <Route path="/sign" element={<Sign />} />
                <Route path="/sku/:address/:product_id/:production_id" element={<SKU />} />
                <Route path="/costumers" element={<Costumers />} />
                <Route path="/empresa/:address" element={<Empresa />} />
                <Route path="/productions/:address/:product_id" element={<Productions />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
