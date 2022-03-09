import { useCallback, useState } from "react";

import Button from "../../components/Button";

import WarningImg from "../../images/icons/warning.png";
import CodeMonkeyImg from "../../images/miscellaneous/code-monkey.jpeg";
import { randInt, shuffleArr } from "../../utils";

import Popup from "./Popup";
import Game from "../../Game";

enum QuestionType {
   addition,
   subtraction,
   multiplication,
   division
}

const getQuestionType = (difficulty: number): QuestionType => {
   if (difficulty <= 3) {
      return QuestionType.addition;
   } else if (difficulty <= 5) {
      return QuestionType.subtraction;
   } else if (difficulty <= 7) {
      return QuestionType.multiplication;
   } else if (difficulty <= 9) {
      return QuestionType.division;
   }
   throw new Error("Difficulty was too high!");
}

const getQuestion = (questionType: QuestionType): [question: string, answers: Array<string | number>, answer: string | number] => {
   switch (questionType) {
      case QuestionType.addition: {
         const num1 = randInt(1, 6);
         const num2 = randInt(1, 6);

         const answer = num1 + num2;

         let answers = new Array<number>();
         answers.push(answer - 2);
         answers.push(answer * 2 + 1);
         answers.push(answer + 1);
         answers.push(answer);
         answers = shuffleArr(answers);

         return [`${num1} + ${num2} =`, answers, answer];
      }
      case QuestionType.subtraction: {
         const num1 = randInt(1, 6);
         const num2 = randInt(1, 6);

         const answer = num1 - num2;

         let answers = new Array<number>();
         answers.push(answer - 3);
         answers.push(answer * 2 + 1);
         answers.push(answer - 1);
         answers.push(answer);
         answers = shuffleArr(answers);

         return [`${num1} - ${num2} =`, answers, answer];
      }
      case QuestionType.multiplication: {
         const num1 = randInt(1, 6);
         const num2 = randInt(1, 6);

         const answer = num1 * num2;

         let answers = new Array<number>();
         answers.push(answer - 8);
         answers.push(answer * 2 + 1);
         answers.push(answer - 2);
         answers.push(answer);
         answers = shuffleArr(answers);

         return [`${num1} * ${num2} =`, answers, answer];
      }
      case QuestionType.division: {
         const num1 = randInt(2, 6);
         const num2 = num1 * randInt(3, 8);

         const answer = num2 / num1;

         let answers = new Array<number>();
         answers.push(answer - 2);
         answers.push(answer * 3 - 1);
         answers.push(answer + 5);
         answers.push(answer);
         answers = shuffleArr(answers);

         return [`${num2} / ${num1} =`, answers, answer];
      }
   }
   throw new Error("Unknown question type!");
}

interface QuestionScreenProps {
   difficulty: number;
   nextFunc: () => void;
   closeFunc: () => void;
}
const QuestionScreen = ({ difficulty, nextFunc, closeFunc }: QuestionScreenProps): JSX.Element => {
   let content!: JSX.Element;
   if (difficulty === 0) {
      content = <>
         <p>Do you really want to close this?</p>
         <Button onClick={nextFunc} isCentered>Yes</Button>
      </>;
   } else if (difficulty === 1) {
      content = <>
         <p>Are you assure?</p>
         <Button onClick={nextFunc} isCentered>Yes</Button>
      </>;
   } else {
      // When difficulty > 1
      const questionType = getQuestionType(difficulty);
      const [question, answers, answer] = getQuestion(questionType);

      content = <>
         <p>{question}</p>
         {answers.map((currentAnswer, i) => {
            return <Button onClick={currentAnswer === answer ? nextFunc : closeFunc} isCentered key={i}>{currentAnswer.toString()}</Button>
         })}
      </>
   }

   return <div className="closing-screen">
      {content}
   </div>;
}

enum Stage {
   Waiting,
   Requirements,
   Closing
}

interface ElemProps {
   popup: DevHire;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const MAX_DIFFICULTY = 6;
   
   const [stage, setStage] = useState<Stage>(Stage.Waiting);
   const [questionDifficulty, setQuestionDifficulty] = useState<number>(0);

   const startClose = (): void => {
      setStage(Stage.Closing);
   }

   const openRequirements = (): void => {
      setStage(Stage.Requirements);
   }

   const closeQuestions = (): void => {
      setStage(Stage.Waiting);
      setQuestionDifficulty(0);
   }

   const nextQuestion = useCallback(() => {
      if (questionDifficulty + 1 >= MAX_DIFFICULTY) {
         popup.close();
      } else {
         const newQuestionDifficulty = questionDifficulty + 1;
         setQuestionDifficulty(newQuestionDifficulty);
      }
   }, [popup, questionDifficulty]);
   
   return <>
      <div className="warning-container">
         <img src={WarningImg} alt="warning!" />
         <p>Developer position wanted!</p>
      </div>

      <img src={CodeMonkeyImg} className="code-monkey" alt="le epic coding monkey" />

      <p>Are you do the java script?</p>
      <p>Do you are wanting an entry level job for &#36;12/h?</p>
      <p>Apply now in order win depression!</p>

      <div onClick={openRequirements} className="rainbow-bg">
         <span>View job requirements</span>   
      </div>

      {stage === Stage.Closing ? (
         <QuestionScreen difficulty={questionDifficulty} nextFunc={nextQuestion} closeFunc={closeQuestions} />
      ) : undefined}

      {stage === Stage.Requirements ? (
         <ul>
            <li>20 years experience in Javascript.</li>
            <li>Past job experience as a senior programmer.</li>
            <li>At least 219 IQ.</li>
            <li>PhD in quantum mechanics.</li>
            <li>40 years experience working with modern front-end frameworks.</li>
            <li>ATAR of 99.95 or above.</li>
            <li>Past experience working at Google.</li>
            <li>Created Microsoft.</li>
            <li>At least 2 companies valued at 5 million dollars or above.</li>
            <li>At least 7'4".</li>
            <li>Has at least 2 brains.</li>
            <li>Experience working with and maintaining databases.</li>
            <li>Is God.</li>
            <li>Competed High School at least twice.</li>
            <li>Likes pouring milk before cereal.</li>
            <li>Plays at least one sport professionally.</li>
            <li>Able to speak at least 5 languages fluently.</li>
            <li>Legally allowed to fly airplanes.</li>
            <li>Owns a tricycle.</li>
            <li>Attained enlightenment.</li>
         </ul>
      ) : undefined}

      <Button onClick={startClose} isCentered>Close</Button>
   </>;
}

class DevHire extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />
   }

   close(): void {
      super.close();

      Game.lorem += this.info.elem.loremReward!;
   }
}

export default DevHire;