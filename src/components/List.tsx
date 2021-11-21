import React from "react";

interface ListProps {
   hasBulletPoints?: boolean;
   children?: JSX.Element;
}

const defaultProps: ListProps = {
   hasBulletPoints: true
}

const List: React.FunctionComponent<ListProps> = (props: ListProps) => {
   return (
      <ul className={`${props.hasBulletPoints ? "bullet-points" : ""}`}>
         {props.children}
      </ul>
   )
}

List.defaultProps = defaultProps;

export default List;
