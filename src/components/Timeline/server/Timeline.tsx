import { expandClassMap } from "@/utils/propAliases";
import Skeleton from "../../Skeleton/server/Skeleton";
import TimelineBase from "../TimelineBase";
import { TimelineProps } from "../Timeline.types";
import styles from "../next/Timeline.module.scss";

export type ServerTimelineProps = TimelineProps;

export default function Timeline(props: ServerTimelineProps) {
  return (
    <TimelineBase
      {...props}
      SkeletonComponent={Skeleton}
      classMap={expandClassMap(styles)}
    />
  );
}
