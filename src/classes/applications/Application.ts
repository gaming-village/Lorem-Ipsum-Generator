abstract class Application {
   private readonly name: string;
   private readonly description: string;
   private readonly cost: number;
   private readonly id: string;

   private isUnlocked: boolean = false;
   private isOpened: boolean = false;
   constructor(name: string, description: string, id: string, cost: number) {
      this.name = name;
      this.description = description;
      this.id = id;
      this.cost = cost;

      this.instantiate();
   }

   protected abstract instantiate(): JSX.Element;

   unlock(): void {
      if (this.isUnlocked) return;

      this.isUnlocked = true;
   }

   openApplication() {
      if (this.isOpened) return;
      this.isOpened = true;
   }
   closeApplication() {
      if (!this.isOpened) return;
      this.isOpened = false;
   }
}

export default Application;