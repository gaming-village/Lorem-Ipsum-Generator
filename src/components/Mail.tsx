import React, { useEffect, useState } from "react";
import "../css/mail.css";
import { LetterInfo } from "../data/letter-data";
import { claimReward, createFolderListener, createMailReceiveEvent, getInboxMail, mail, openMail } from "../mail";
import Button from "./Button";
import Program from "./Program";
import ScrollArea from "./ScrollArea";
import Section from "./Section";
import SectionContainer from "./SectionContainer";

const Mail = () => {
   const [letter, setLetter] = useState(undefined as unknown as LetterInfo);
   const [, setFolder] = useState("");
   const [, setReceivedLetter] = useState(undefined as unknown as LetterInfo);

   const [rewardIsClaimed, setRewardClaimed] = useState(false);

   useEffect(() => {
      mail.updateMailEvent = () => {
         setLetter(mail.currentLetter);

         let newRewardIsClaimed = mail.currentLetter && mail.currentLetter.reward ? mail.currentLetter.reward.isClaimed : false;
         setRewardClaimed(newRewardIsClaimed);
      }

      createFolderListener(() => {
         setFolder(mail.currentSelectedFolder);
      })

      createMailReceiveEvent(() => {
         setReceivedLetter(mail.receivedLetter);
      })
   }, [])

   return (
      <div id="mail" className="view">
         <div className="center-container">
            <Button onClick={openMail} text="Open Mail" />
         </div>

         <div id="mail-container" className="hidden">
            <Program id="inbox" title="Inbox" isDraggable={false} hasMinimizeButton={false}>
               <>
               <div className="left">
                  <div className="folder-container text-box">
                     <div className="folder root-folder">
                        <div className="icon"></div>
                        <span>Microsoft Exchange</span>
                     </div>
                  </div>
               </div>
               <div className="right">
                  <ScrollArea scrollType="vertical">
                     <>
                        <SectionContainer>
                           <>
                              <Section content={<img src={require("../images/icons/white-letter.png").default} alt="" />} fillType="shrink" />
                              <Section content="From" fillType="fill" />
                              <Section content="Subject" fillType="fill" />
                           </>
                        </SectionContainer>
                        <div className="letter-container">
                           {getInboxMail()}
                        </div>
                     </>
                  </ScrollArea>
               </div>
               </>
            </Program>

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

                     <p>- {letter.from}</p>
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
