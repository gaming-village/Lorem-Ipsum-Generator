import Application from './Application';

interface ElemProps {
   application: AchievementTracker;
}
const Elem = ({ application }: ElemProps): JSX.Element => {

   return <>
      
   </>;
}

class AchievementTracker extends Application {
   constructor() {
      super("Achievement Tracker", "achievementTracker", "Achieve", 5);
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default AchievementTracker;