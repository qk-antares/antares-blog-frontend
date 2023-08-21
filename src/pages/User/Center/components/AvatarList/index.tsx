import { Avatar, Tooltip } from 'antd';

import React from 'react';

export declare type SizeType = number | 'small' | 'default' | 'large';

export type AvatarItemProps = {
  tips: React.ReactNode;
  src: string;
  size?: SizeType;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export type AvatarListProps = {
  Item?: React.ReactElement<AvatarItemProps>;
  size?: SizeType;
  maxLength?: number;
  excessItemsStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  children: React.ReactElement<AvatarItemProps> | React.ReactElement<AvatarItemProps>[];
};


const Item: React.FC<AvatarItemProps> = ({ src, size, tips, onClick = () => {} }) => {

  return (
    <li  onClick={onClick}>
      {tips ? (
        <Tooltip title={tips}>
          <Avatar src={src} size={size} style={{ cursor: 'pointer' }} />
        </Tooltip>
      ) : (
        <Avatar src={src} size={size} />
      )}
    </li>
  );
};

const AvatarList: React.FC<AvatarListProps> & { Item: typeof Item } = ({
                                                                         children,
                                                                         size,
                                                                         maxLength = 5,
                                                                         excessItemsStyle,
                                                                         ...other
                                                                       }) => {
  const numOfChildren = React.Children.count(children);
  const numToShow = maxLength >= numOfChildren ? numOfChildren : maxLength;
  const childrenArray = React.Children.toArray(children) as React.ReactElement<AvatarItemProps>[];
  const childrenWithProps = childrenArray.slice(0, numToShow).map((child) =>
    React.cloneElement(child, {
      size,
    }),
  );

  if (numToShow < numOfChildren) {

    childrenWithProps.push(
      <li key="exceed" >
        <Avatar size={size} style={excessItemsStyle}>{`+${numOfChildren - maxLength}`}</Avatar>
      </li>,
    );
  }

  return (
    <div {...other}>
      <ul> {childrenWithProps} </ul>
    </div>
  );
};

AvatarList.Item = Item;

export default AvatarList;
