"use client";

import { useState, useCallback } from "react";
import { RoomPolls } from "./RoomPolls";
import { RoomProposeForm } from "./RoomProposeForm";

interface RoomPollSectionProps {
  slug: string;
}

export function RoomPollSection({ slug }: RoomPollSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const onProposed = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  return (
    <>
      <RoomPolls slug={slug} refreshTrigger={refreshTrigger} />
      <RoomProposeForm slug={slug} onProposed={onProposed} />
    </>
  );
}
