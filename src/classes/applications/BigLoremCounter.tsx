import Application from "./Application";

const Elem = () => {
   return <>
      <p>Big lorem counter</p>
   </>
}

class BigLoremCounter extends Application {
   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default BigLoremCounter;