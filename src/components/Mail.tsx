import React, { useEffect, useState } from "react";
import "../css/mail.css";
import { claimReward, mail } from "../mail";
import Button from "./Button";
import Program from "./Program";

const Mail = () => {
   const [letter, setLetter] = useState(mail.letters[0]);
   const [rewardIsClaimed, setRewardClaimed] = useState(false);

   useEffect(() => {
      mail.updateMailEvent = () => {
         console.log("Updating");
         setLetter(mail.currentLetter);

         let newRewardIsClaimed = mail.currentLetter.reward ? mail.currentLetter.reward.isClaimed : false;
         setRewardClaimed(newRewardIsClaimed);
      }
   }, [])

   return (
      <div id="mail" className="view">
         <div id="mail-opener">
            mail opener!11!1
         </div>
         <div id="mail-container" className="hidden">
            <div id="inbox" className="windows-program">

            </div>

            {mail.currentLetter !== undefined ?
            <Program id="letter" title={`${letter.subject} - Microsoft Exchange`} titleStyle="bold" titleIconSrc={require("../images/icons/letter.png").default} hasMinimizeButton={false} isDraggable={false}>
               <>
                  <table>
                     <tbody>
                        <tr>
                           <td>From:</td>
                           <td>{letter.from}</td>
                        </tr>
                        <tr>
                           <td>To:</td>
                           <td>You</td>
                        </tr>
                        <tr>
                           <td>Subject:</td>
                           <td className="text-box">{letter.subject}</td>
                        </tr>
                     </tbody>
                  </table>

                  <div id="letter-body" className="text-box">
                     <h1>{letter.subject}</h1>

                     {letter.body}
                  </div>

                  <div className={`reward-container text-box ${rewardIsClaimed ? "claimed" : ""}`}>
                     {letter.reward ?
                     <>
                        <h2>Rewards</h2>

                        <div className="reward">
                           <div className="icon-box">
                              <img src={require(`../images/${letter.reward.imgSrc}`).default} alt="" />
                           </div>
                           <div className="text">{letter.reward.name}</div>
                        </div>

                        {console.log(letter.reward.isClaimed ? "Already claimed" : "Claim")}
                        <Button onClick={() => claimReward(letter)} className={rewardIsClaimed ? "dark" : "no"} text={rewardIsClaimed ? "Already claimed" : "Claim"} isCentered={true} />
                     </>
                     :
                     <p style={{ textAlign: "center", fontStyle: "italic" }}>This letter has no rewards!</p>
                     }
                  </div>
               </>
            </Program>
            : "" }
         </div>
      </div>
   )
}

export default Mail;
