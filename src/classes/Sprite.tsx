type SpritesheetName = "upgrade-icons";

class Sprite {
   private readonly width: number;
   private readonly height: number;
   private readonly spritesheetName: string;
   private readonly icon: number;

   readonly element!: JSX.Element;

   constructor(width: number, height: number, spritesheetName: SpritesheetName, icon: number) {
      this.width = width;
      this.height = height;
      this.spritesheetName = spritesheetName;
      this.icon = icon;

      this.element = this.createElement();
   }

   createElement(): JSX.Element {
      const spritesheet = require(`../images/spritesheets/${this.spritesheetName}.png`).default;

      const x = this.icon % 32 * this.width;
      const y = Math.floor(this.icon / 32) * this.height;
      const w = this.width * 32;
      const h = this.height * 32;
      const style: React.CSSProperties = {
         backgroundImage: `url(${spritesheet})`,
         backgroundSize: `${w}px ${h}px`,
         width: this.width + "px",
         height: this.height + "px",
         backgroundPosition: `${-x}px ${-y}px`
      };

      const element = <div className="sprite-icon" style={style}></div>;

      return element;
   }
}

export default Sprite;