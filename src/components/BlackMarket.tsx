import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

import "../css/black-market.css";
import { BlackMarketShop, BLACK_MARKET_SHOPS } from '../data/black-market-data';
import Game from '../Game';
import { randInt, randItem, roundNum } from '../utils';

interface ShopProps {
   shop: BlackMarketShop;
}
const Shop = ({ shop }: ShopProps) => {
   return <div className="shop">
      <h2>{shop.name}</h2>

      <Link to={"/" + shop.pageName}>
         <button>Go</button>
      </Link>
   </div>
}

const Shops = () => {
   return <div className="shops">
      {BLACK_MARKET_SHOPS.map((shop, i) => <Shop key={i} shop={shop} />)}
   </div>
}

interface FallingText {
   age: number;
   elem: HTMLElement;
}
let fallingTexts = new Array<FallingText>();
const createFallingText = (blackMarket: HTMLElement): void => {
   if (blackMarket === null) return;
   
   const potentialText = "0123456789!@#$%^&*()";
   const text = randItem(potentialText.split(""));
   
   const fallingText = document.createElement("div");
   fallingText.innerHTML = text;
   fallingText.className = "falling-text";
   fallingText.style.left = randInt(0, 25) * 4 + 1.25 + "%";
   fallingTexts.push({
      age: 0,
      elem: fallingText
   });
   blackMarket.appendChild(fallingText);
}

let hasRenderListener = false;

const BlackMarket = () => {
   const blackMarket = useRef(null);
   const [packets, setPackets] = useState(0);
   const [lorem, setLorem] = useState(0);

   useEffect(() => {
      const updateFunc = (): void => {
         if (lorem !== Game.lorem) setLorem(Game.lorem);
         if (packets !== Game.packets) setPackets(Game.packets);

         if (Math.random() < 5 / Game.tps) {
            createFallingText(blackMarket.current!);
         }

         let textsToRemove = new Array<FallingText>();
         for (const text of fallingTexts) {
            if (text.age++ >= 200) {
               textsToRemove.push(text);
            }
            text.elem.style.top = text.age * Game.tps / 40 + "%";
            text.elem.style.opacity = Math.pow(text.age / 200, 1.2).toString();
         }

         for (const textToRemove of textsToRemove) {
            textToRemove.elem.remove();

            const idx = fallingTexts.indexOf(textToRemove);
            fallingTexts.splice(idx, 1);
         }
      }

      if (!hasRenderListener) Game.createRenderListener(updateFunc);
      hasRenderListener = true;
   }, [lorem, packets]);

   const exchangeAmount = Game.lorem * Game.packetExchangeRate;

   const exchangePackets = (): void => {
      Game.lorem = 0;
      Game.packets += exchangeAmount;
   }

   return <div ref={blackMarket} id="black-market" className="view">
      <div className="top-container">
         <div className="packet-counter">
            <h2>{roundNum(packets)} Packets</h2>
         </div>

         <div className="transfer-rate">
            <p>Transfer rate:</p>
            <p>{Game.packetExchangeRate} lorem -&gt; 1 packet</p>
         </div>
      </div>

      <div className="exchange-container">
         <div className="heading">
            <h2>Currency Exchange</h2>
         </div>

         <div className="exchange">
            <h3>{roundNum(lorem)} LOREM</h3>
            <h4>CONVERTS TO</h4>
            <h2>{roundNum(exchangeAmount)} PACKETS</h2>
         </div>

         <button onClick={exchangeAmount > 0 ? exchangePackets : undefined} className={exchangeAmount <= 0 ? "dark" : ""}>EXCHANGE</button>
      </div>

      <Shops />
   </div>;
}

export default BlackMarket;