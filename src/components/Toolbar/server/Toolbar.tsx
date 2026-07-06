import { expandClassMap } from "@/utils/propAliases";
import { AvatarProps } from "../../Avatar/Avatar.types";
import Avatar from "../../Avatar/server/Avatar";
import ToolbarBase from "../ToolbarBase";
import { ToolbarProps } from "../Toolbar.types";
import styles from "../next/Toolbar.module.scss";

type ToolbarAvatar = NonNullable<ToolbarProps["avatar"]>;

export type ServerToolbarProps = Omit<ToolbarProps, "avatar"> & {
  avatar?: Omit<ToolbarAvatar, "onClick">;
};

const StaticAvatar = (props: AvatarProps) => {
  const { onClick, imageFill, ...staticProps } = props;
  void onClick;
  void imageFill;
  return <Avatar {...staticProps} />;
};

export default function Toolbar(props: ServerToolbarProps) {
  return (
    <ToolbarBase
      {...props}
      AvatarComponent={StaticAvatar}
      classMap={expandClassMap(styles)}
    />
  );
}
